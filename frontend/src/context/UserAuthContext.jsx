import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getCurrentUserProfileService,
  getStoredUserToken,
  removeStoredUserToken,
  setStoredUserToken,
} from "@/services/userAuth.service";

const UserAuthContext = createContext({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: () => {},
  logout: () => {},
  isSignInModalOpen: false,
  openSignInModal: () => {},
  closeSignInModal: () => {},
  signInModalOptions: {},
});

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInModalOptions, setSignInModalOptions] = useState({});
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    const token = getStoredUserToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUserProfileService();
      setUser(userData);
    } catch {
      setUser(null);
      removeStoredUserToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((token, userData) => {
    setStoredUserToken(token);
    setUser(userData);
    setIsSignInModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    removeStoredUserToken();
    setUser(null);
  }, []);

  const openSignInModal = useCallback((options = {}) => {
    setSignInModalOptions(options);
    setIsSignInModalOpen(true);
  }, []);

  const closeSignInModal = useCallback(() => {
    setIsSignInModalOpen(false);
    setSignInModalOptions({});
  }, []);

  const openProfileModal = useCallback(() => {
    setIsProfileModalOpen(true);
  }, []);

  const closeProfileModal = useCallback(() => {
    setIsProfileModalOpen(false);
  }, []);

  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        loading,
        login,
        logout,
        checkAuth,
        isSignInModalOpen,
        openSignInModal,
        closeSignInModal,
        signInModalOptions,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
        updateUser,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
