import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { sendResponse } from "../utils/apiResponse.js";

const parseCookieHeader = (cookieHeader) => {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [key, ...v] = cookie.trim().split("=");
      return [key, v.join("=")];
    }),
  );
};

const generateUserToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: "user",
      type: "user",
      iss: "portfolio-api",
      aud: "portfolio-user",
    },
    env.jwtSecret,
    { expiresIn: "7d" },
  );
};

// 1. Google OAuth — Redirect to Google consent screen
export const initiateGoogleAuth = (_req, res) => {
  if (!env.googleClientId) {
    res.status(400).json({
      success: false,
      message:
        "Google OAuth is not configured yet. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment.",
    });
    return;
  }

  const state = crypto.randomBytes(32).toString("hex");
  res.cookie("g_oauth_state", state, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000, // 10 minutes
  });

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: env.googleCallbackUrl,
    client_id: env.googleClientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    state,
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options).toString();
  res.redirect(`${rootUrl}?${qs}`);
};

// 2. Google OAuth — Callback handler
export const handleGoogleCallback = async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;
  const state = req.query.state;

  const cookies = req.cookies || parseCookieHeader(req.headers.cookie);
  const cookieState = cookies.g_oauth_state;

  res.clearCookie("g_oauth_state");

  if (error || !code || !state || !cookieState || state !== cookieState) {
    console.error("[UserAuth] Google Callback state or CSRF error:", {
      hasCode: Boolean(code),
      hasState: Boolean(state),
      stateMatched: Boolean(state && state === cookieState),
    });
    res.redirect(`${env.frontendUrl}/auth/callback?error=invalid_state`);
    return;
  }

  try {
    // Exchange auth code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: env.googleClientId,
        client_secret: env.googleClientSecret,
        redirect_uri: env.googleCallbackUrl,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("[UserAuth] Google token exchange error:", tokenData);
      const errDetail = encodeURIComponent(
        tokenData.error_description || tokenData.error || "token_exchange_failed",
      );
      res.redirect(`${env.frontendUrl}/auth/callback?error=${errDetail}`);
      return;
    }

    // Fetch user profile from Google
    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );

    const googleUser = await profileResponse.json();

    const isEmailVerified =
      googleUser.email_verified === true ||
      googleUser.verified_email === true ||
      googleUser.email_verified === "true";

    if (!profileResponse.ok || !googleUser.email || !isEmailVerified) {
      res.redirect(`${env.frontendUrl}/auth/callback?error=profile_fetch_failed`);
      return;
    }

    // Find or create User in MongoDB
    let user = await User.findOne({
      $or: [{ googleId: googleUser.id }, { email: googleUser.email.toLowerCase() }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleUser.id;
      }
      user.avatar = googleUser.picture || user.avatar;
      user.name = user.name || googleUser.name;
      user.isEmailVerified = true;
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      user = await User.create({
        googleId: googleUser.id,
        email: googleUser.email.toLowerCase(),
        name: googleUser.name || "User",
        avatar: googleUser.picture || "",
        authProvider: "google",
        isEmailVerified: true,
        lastLoginAt: new Date(),
      });
    }

    const token = generateUserToken(user);
    res.redirect(`${env.frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`);
  } catch (err) {
    console.error("[UserAuth] Google Callback Exception:", err.message);
    res.redirect(`${env.frontendUrl}/auth/callback?error=server_error`);
  }
};

// 3. Direct Google ID Token Verification (Google One Tap / Google Button)
export const handleGoogleCredential = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      throw new ApiError(400, "Google credential token is required");
    }

    // Verify ID Token with Google
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
    );
    const googleUser = await response.json();

    if (!response.ok || !googleUser.email) {
      throw new ApiError(401, "Invalid Google credential");
    }

    if (env.googleClientId && googleUser.aud !== env.googleClientId) {
      throw new ApiError(401, "Invalid Google credential audience");
    }

    const isEmailVerified =
      googleUser.email_verified === true || googleUser.email_verified === "true";

    if (!isEmailVerified) {
      throw new ApiError(401, "Google email is not verified");
    }

    let user = await User.findOne({
      $or: [{ googleId: googleUser.sub }, { email: googleUser.email.toLowerCase() }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleUser.sub;
      }
      user.avatar = googleUser.picture || user.avatar;
      user.isEmailVerified = true;
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      user = await User.create({
        googleId: googleUser.sub,
        email: googleUser.email.toLowerCase(),
        name: googleUser.name || "User",
        avatar: googleUser.picture || "",
        authProvider: "google",
        isEmailVerified: true,
        lastLoginAt: new Date(),
      });
    }

    const token = generateUserToken(user);

    sendResponse(res, 200, "Signed in with Google successfully", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 4. Email / Password Register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email, and password are required");
    }

    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      throw new ApiError(
        409,
        "An account with this email already exists. Please sign in instead.",
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      authProvider: "local",
      isEmailVerified: false,
      lastLoginAt: new Date(),
    });

    const token = generateUserToken(user);

    sendResponse(res, 201, "Account created successfully", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 5. Email / Password Login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (user.authProvider === "google" && !user.passwordHash) {
      throw new ApiError(
        400,
        "This account was created with Google Sign-In. Please sign in with Google.",
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateUserToken(user);

    sendResponse(res, 200, "Signed in successfully", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 6. Get Current User Profile
export const getCurrentUser = async (req, res) => {
  sendResponse(res, 200, "User profile fetched successfully", {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      authProvider: req.user.authProvider,
      createdAt: req.user.createdAt,
    },
  });
};
