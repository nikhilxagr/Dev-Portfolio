import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import PaymentTransaction from "../models/PaymentTransaction.js";
import ArticleInteraction from "../models/ArticleInteraction.js";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { sendResponse } from "../utils/apiResponse.js";
import {
  sendNewUserWelcomeEmail,
  sendUserWelcomeBackEmail,
} from "../services/mailer.service.js";

const recordUserLoginSession = (user, req) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Web Browser";

    user.loginCount = (user.loginCount || 0) + 1;
    user.lastLoginAt = new Date();

    if (!Array.isArray(user.loginHistory)) {
      user.loginHistory = [];
    }

    user.loginHistory.unshift({
      ip,
      userAgent,
      device: userAgent.includes("Mobile")
        ? "Mobile Device"
        : userAgent.includes("Tablet")
          ? "Tablet"
          : "Desktop",
      loggedInAt: new Date(),
    });

    if (user.loginHistory.length > 25) {
      user.loginHistory = user.loginHistory.slice(0, 25);
    }
  } catch (err) {
    console.error("[UserAuth] Error recording login session:", err);
  }
};

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

// Dispatches welcome or welcome-back email with clear delivery status logging
const dispatchWelcomeEmail = (isNewUser, user) => {
  if (!user || !user.email) return;

  const emailPromise = isNewUser
    ? sendNewUserWelcomeEmail({ email: user.email, name: user.name })
    : sendUserWelcomeBackEmail({ email: user.email, name: user.name });

  emailPromise
    .then((result) => {
      if (result?.simulated) {
        console.warn(
          `[UserAuth] ⚠️ Welcome email simulated for ${user.email}: SMTP_PASS is empty or not saved in server environment.`,
        );
      } else if (result?.sent) {
        console.log(
          `[UserAuth] ✅ Welcome email delivered successfully to ${user.email} (MessageId: ${result.messageId})`,
        );
      } else {
        console.error(
          `[UserAuth] ❌ Failed to deliver welcome email to ${user.email}:`,
          result?.error,
        );
      }
    })
    .catch((err) => {
      console.error(
        `[UserAuth] ❌ Exception delivering welcome email to ${user.email}:`,
        err.message,
      );
    });
};

// Validate allowed frontend origins for safe redirects
export const isAllowedFrontendOrigin = (origin) => {
  if (!origin || typeof origin !== "string") return false;
  try {
    const url = new URL(origin);
    const host = url.hostname;
    // Allow localhost or 127.0.0.1 on any port (e.g., 5173, 5174, etc.)
    if (host === "localhost" || host === "127.0.0.1") return true;
    // Allow production domain and Vercel preview domains
    if (host === "nikhilxagr.vercel.app" || host.endsWith(".vercel.app")) return true;
    // Allow any explicitly allowed origins
    if (env.allowedOrigins && env.allowedOrigins.some((o) => o.includes(host))) return true;
    return false;
  } catch {
    return false;
  }
};

// Create a cryptographically signed, tamper-proof state containing origin & redirectUri
const createSignedState = (targetOrigin, redirectUri) => {
  const payload = {
    nonce: crypto.randomBytes(16).toString("hex"),
    origin: targetOrigin,
    redirectUri,
    ts: Date.now(),
  };
  const jsonStr = JSON.stringify(payload);
  const base64Data = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", env.jwtSecret)
    .update(base64Data)
    .digest("base64url");
  return `${base64Data}.${signature}`;
};

// Verify the signed state parameter
const verifySignedState = (stateParam) => {
  if (!stateParam || typeof stateParam !== "string") return null;
  const parts = stateParam.split(".");
  if (parts.length !== 2) return null;
  const [base64Data, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", env.jwtSecret)
    .update(base64Data)
    .digest("base64url");

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(base64Data, "base64url").toString("utf8");
    const payload = JSON.parse(jsonStr);
    // 15-minute expiration window to prevent replay attacks
    if (Date.now() - payload.ts > 15 * 60 * 1000) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

// 1. Google OAuth — Redirect to Google consent screen
export const initiateGoogleAuth = (req, res) => {
  if (!env.googleClientId) {
    res.status(400).json({
      success: false,
      message:
        "Google OAuth is not configured yet. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment.",
    });
    return;
  }

  // Detect initiating frontend origin (localhost:5173 vs nikhilxagr.vercel.app)
  let requestedOrigin = req.query.origin;
  if (!requestedOrigin && req.headers.referer) {
    try {
      requestedOrigin = new URL(req.headers.referer).origin;
    } catch {
      // ignore
    }
  }

  const targetOrigin =
    requestedOrigin && isAllowedFrontendOrigin(requestedOrigin)
      ? requestedOrigin
      : env.frontendUrl;

  // Determine Google callback URI based on current request host
  const host = req.headers.host || "";
  const isLocalHost = host.includes("localhost") || host.includes("127.0.0.1");
  let redirectUri = env.googleCallbackUrl;
  if (isLocalHost) {
    const protocol = req.protocol === "https" ? "https" : "http";
    redirectUri = `${protocol}://${host}/api/user-auth/google/callback`;
  }

  // Create tamper-proof signed state carrying origin and redirectUri
  const state = createSignedState(targetOrigin, redirectUri);

  // Set cookie as well for backward compatibility
  res.cookie("g_oauth_state", state, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: redirectUri,
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

  const statePayload = verifySignedState(state);
  const cookies = req.cookies || parseCookieHeader(req.headers.cookie);
  const cookieState = cookies.g_oauth_state;

  res.clearCookie("g_oauth_state");

  // Determine target frontend to redirect back to (e.g. http://localhost:5173 or https://nikhilxagr.vercel.app)
  let targetFrontend = env.frontendUrl;
  if (statePayload?.origin && isAllowedFrontendOrigin(statePayload.origin)) {
    targetFrontend = statePayload.origin;
  }

  // Use the exact redirect_uri that was sent to Google during initialization
  const redirectUri = statePayload?.redirectUri || env.googleCallbackUrl;

  const isStateValid = Boolean(
    statePayload || (state && cookieState && state === cookieState)
  );

  if (error || !code || !isStateValid) {
    console.error("[UserAuth] Google Callback state or CSRF error:", {
      hasCode: Boolean(code),
      hasState: Boolean(state),
      signedStateValid: Boolean(statePayload),
      cookieMatched: Boolean(state && state === cookieState),
      targetFrontend,
    });
    const errCode = error === "access_denied" ? "access_denied" : "invalid_state";
    res.redirect(`${targetFrontend}/auth/callback?error=${errCode}`);
    return;
  }

  try {
    // Exchange auth code for tokens with matching redirect_uri
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: env.googleClientId,
        client_secret: env.googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("[UserAuth] Google token exchange error:", tokenData);
      const errDetail = encodeURIComponent(
        tokenData.error_description || tokenData.error || "token_exchange_failed",
      );
      res.redirect(`${targetFrontend}/auth/callback?error=${errDetail}`);
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
      res.redirect(`${targetFrontend}/auth/callback?error=profile_fetch_failed`);
      return;
    }

    // Find or create User in MongoDB
    let user = await User.findOne({
      $or: [{ googleId: googleUser.id }, { email: googleUser.email.toLowerCase() }],
    });
    const isNewUser = !user;

    if (user) {
      if (!user.googleId) {
        user.googleId = googleUser.id;
      }
      user.avatar = user.avatar || googleUser.picture || "";
      user.name = user.name || googleUser.name || "User";
      user.isEmailVerified = true;
      recordUserLoginSession(user, req);
      await user.save();
    } else {
      user = new User({
        googleId: googleUser.id,
        email: googleUser.email.toLowerCase(),
        name: googleUser.name || "User",
        avatar: googleUser.picture || "",
        authProvider: "google",
        isEmailVerified: true,
      });
      recordUserLoginSession(user, req);
      await user.save();
    }

    // Trigger Welcome or Welcome Back email with delivery verification
    dispatchWelcomeEmail(isNewUser, user);

    const token = generateUserToken(user);
    res.redirect(`${targetFrontend}/auth/callback?token=${encodeURIComponent(token)}`);
  } catch (err) {
    console.error("[UserAuth] Google Callback Exception:", err.message);
    res.redirect(`${targetFrontend}/auth/callback?error=server_error`);
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
    const isNewUser = !user;

    if (user) {
      if (!user.googleId) {
        user.googleId = googleUser.sub;
      }
      user.avatar = user.avatar || googleUser.picture || "";
      user.name = user.name || googleUser.name || "User";
      user.isEmailVerified = true;
      recordUserLoginSession(user, req);
      await user.save();
    } else {
      user = new User({
        googleId: googleUser.sub,
        email: googleUser.email.toLowerCase(),
        name: googleUser.name || "User",
        avatar: googleUser.picture || "",
        authProvider: "google",
        isEmailVerified: true,
      });
      recordUserLoginSession(user, req);
      await user.save();
    }

    // Trigger Welcome or Welcome Back email with delivery verification
    dispatchWelcomeEmail(isNewUser, user);

    const token = generateUserToken(user);

    sendResponse(res, 200, "Signed in with Google successfully", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
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

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      authProvider: "local",
      isEmailVerified: false,
    });
    recordUserLoginSession(user, req);
    await user.save();

    dispatchWelcomeEmail(true, user);

    const token = generateUserToken(user);

    sendResponse(res, 201, "Account created successfully", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified,
        loginCount: user.loginCount || 1,
        lastLoginAt: user.lastLoginAt || user.createdAt,
        createdAt: user.createdAt,
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

    recordUserLoginSession(user, req);
    await user.save();

    dispatchWelcomeEmail(false, user);

    const token = generateUserToken(user);

    sendResponse(res, 200, "Signed in successfully", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified,
        loginCount: user.loginCount || 1,
        lastLoginAt: user.lastLoginAt || user.createdAt,
        createdAt: user.createdAt,
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
      phone: req.user.phone || "",
      avatar: req.user.avatar || "",
      bio: req.user.bio || "",
      location: req.user.location || "",
      website: req.user.website || "",
      authProvider: req.user.authProvider,
      isEmailVerified: req.user.isEmailVerified,
      loginCount: req.user.loginCount || 1,
      lastLoginAt: req.user.lastLoginAt || req.user.createdAt,
      createdAt: req.user.createdAt,
    },
  });
};

// 7. Update Current User Profile
export const updateCurrentUser = async (req, res, next) => {
  try {
    const { name, phone, bio, location, website, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, "User profile not found");
    }

    if (typeof name === "string") {
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new ApiError(400, "Display name cannot be empty");
      }
      user.name = trimmedName;
    }

    if (typeof phone === "string") {
      user.phone = phone.trim();
    }

    if (typeof bio === "string") {
      user.bio = bio.trim().slice(0, 250);
    }

    if (typeof location === "string") {
      user.location = location.trim().slice(0, 100);
    }

    if (typeof website === "string") {
      user.website = website.trim().slice(0, 200);
    }

    if (typeof avatar === "string") {
      user.avatar = avatar.trim();
    }

    await user.save();

    sendResponse(res, 200, "User profile updated successfully", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified,
        loginCount: user.loginCount || 1,
        lastLoginAt: user.lastLoginAt || user.createdAt,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 8. Get User Activity (Payments, Sign-Ins, Article Interactions, and Aggregated Metrics)
export const getUserActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email ? req.user.email.toLowerCase() : "";

    // 1. Fetch payments for this user
    const payments = await PaymentTransaction.find({
      $or: [
        { userId },
        ...(userEmail ? [{ customerEmail: userEmail }] : []),
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    // 2. Fetch article interactions (likes and comments)
    const interactionDocs = await ArticleInteraction.find({
      $or: [
        { likes: userId },
        { "comments.userId": userId },
      ],
    }).lean();

    const getArticleTitle = (articleId) => {
      if (!articleId) return "System Design Article";
      if (articleId === "url-shortener") return "URL Shortener System Design";
      return articleId
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const userLikes = [];
    const userComments = [];

    interactionDocs.forEach((doc) => {
      const articleTitle = getArticleTitle(doc.articleId);

      // Check if user liked this article
      if (
        Array.isArray(doc.likes) &&
        doc.likes.some((id) => id && id.toString() === userId.toString())
      ) {
        userLikes.push({
          id: `like-${doc.articleId}`,
          type: "like",
          articleId: doc.articleId,
          title: `Liked: ${articleTitle}`,
          description: `Supported and bookmarked ${articleTitle} in System Design lab.`,
          timestamp: doc.updatedAt || doc.createdAt,
          link: `/experiments/system-design/${doc.articleId}`,
        });
      }

      // Check comments by this user
      if (Array.isArray(doc.comments)) {
        doc.comments.forEach((c) => {
          if (c.userId && c.userId.toString() === userId.toString()) {
            userComments.push({
              id: `comment-${c._id}`,
              type: "comment",
              articleId: doc.articleId,
              commentId: c._id,
              title: `Commented on: ${articleTitle}`,
              description: c.content,
              timestamp: c.createdAt,
              link: `/experiments/system-design/${doc.articleId}`,
            });
          }
        });
      }
    });

    // Unified Likes & Comments array sorted descending
    const likesAndComments = [...userLikes, ...userComments].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // 3. Aggregate metrics
    const successfulPayments = payments.filter((p) => p.status === "SUCCESS");
    const paymentsCount = payments.length;
    const receiptsCount = successfulPayments.filter((p) => p.receiptNumber).length;
    const supportTotalInr = successfulPayments.reduce(
      (sum, p) => sum + (p.amountInr || 0),
      0,
    );
    const signInsCount =
      req.user.loginCount || (req.user.loginHistory?.length || 1);

    // 4. Build unified chronological activity feed
    const activities = [];

    // Add payments to activities
    payments.forEach((p) => {
      activities.push({
        id: `payment-${p._id}`,
        type: "payment",
        title: p.serviceName || "Service Payment",
        description: `${p.status === "SUCCESS" ? "Completed contribution of" : "Initiated payment of"} INR ${p.amountInr} (${p.status})`,
        amountInr: p.amountInr,
        status: p.status,
        receiptNumber: p.receiptNumber,
        timestamp: p.createdAt,
        link: p.receiptNumber ? `/receipts` : `/services`,
      });
    });

    // Add likes & comments to activities
    likesAndComments.forEach((item) => {
      activities.push(item);
    });

    // Add sign-ins to activities
    if (Array.isArray(req.user.loginHistory)) {
      req.user.loginHistory.forEach((s, idx) => {
        activities.push({
          id: `signin-${s._id || idx}`,
          type: "signin",
          title: "Account Sign-In",
          description: `Logged in via ${req.user.authProvider === "google" ? "Google Account" : "Email & Password"}${s.ip ? ` (${s.ip})` : ""}`,
          timestamp: s.loggedInAt,
          device: s.device || "Browser",
          ip: s.ip,
        });
      });
    }

    // Sort descending by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sendResponse(res, 200, "User activity fetched successfully", {
      metrics: {
        paymentsCount,
        receiptsCount,
        supportTotalInr,
        signInsCount,
        likesCount: userLikes.length,
        commentsCount: userComments.length,
        likesAndCommentsCount: likesAndComments.length,
      },
      payments: payments.map((p) => ({
        id: p._id,
        serviceName: p.serviceName,
        amountInr: p.amountInr,
        status: p.status,
        receiptNumber: p.receiptNumber,
        createdAt: p.createdAt,
      })),
      interactions: likesAndComments,
      likes: userLikes,
      comments: userComments,
      likesAndComments,
      signIns: (req.user.loginHistory || []).map((s) => ({
        id: s._id,
        ip: s.ip,
        device: s.device,
        userAgent: s.userAgent,
        loggedInAt: s.loggedInAt,
      })),
      activities: activities.slice(0, 50),
    });
  } catch (error) {
    next(error);
  }
};
