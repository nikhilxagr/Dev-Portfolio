import { API_BASE_URL, api, getErrorMessage } from "@/services/api";

const USER_TOKEN_KEY = "portfolio_user_token";

export const getStoredUserToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_TOKEN_KEY);
};

export const setStoredUserToken = (token) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(USER_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(USER_TOKEN_KEY);
  }
};

export const removeStoredUserToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_TOKEN_KEY);
};

export const registerUserService = async ({ name, email, password }) => {
  try {
    const response = await api.post("/user-auth/register", {
      name,
      email,
      password,
    });
    if (response.data?.data?.token) {
      setStoredUserToken(response.data.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Registration failed"));
  }
};

export const loginUserService = async ({ email, password }) => {
  try {
    const response = await api.post("/user-auth/login", { email, password });
    if (response.data?.data?.token) {
      setStoredUserToken(response.data.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Login failed"));
  }
};

export const loginWithGoogleCredentialService = async (credential) => {
  try {
    const response = await api.post("/user-auth/google/credential", {
      credential,
    });
    if (response.data?.data?.token) {
      setStoredUserToken(response.data.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Google sign-in failed"));
  }
};

export const getCurrentUserProfileService = async () => {
  const token = getStoredUserToken();
  if (!token) return null;

  try {
    const response = await api.get("/user-auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data?.data?.user || null;
  } catch {
    removeStoredUserToken();
    return null;
  }
};

export const getGoogleAuthUrl = () => {
  return `${API_BASE_URL.replace(/\/+$/, "")}/user-auth/google`;
};
