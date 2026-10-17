import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserAuth } from "@/context/UserAuthContext";
import { getCurrentUserProfileService } from "@/services/userAuth.service";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useUserAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      let friendlyError = "Google authentication failed. Please try again.";
      if (errorParam === "access_denied") {
        friendlyError = "Google sign-in was canceled.";
      } else if (errorParam === "invalid_state") {
        friendlyError = "Authentication session expired or invalid. Please try signing in again.";
      }
      setError(friendlyError);
      return;
    }

    if (!token) {
      setError("No authentication token received.");
      return;
    }

    // Verify token and fetch profile
    (async () => {
      try {
        localStorage.setItem("portfolio_user_token", token);
        const user = await getCurrentUserProfileService();
        if (user) {
          login(token, user);
          const returnUrl =
            sessionStorage.getItem("auth_return_url") || "/";
          sessionStorage.removeItem("auth_return_url");
          navigate(returnUrl, { replace: true });
        } else {
          setError("Failed to fetch user profile.");
        }
      } catch {
        setError("Sign-in verification failed.");
      }
    })();
  }, [searchParams, login, navigate]);

  const handleRetry = () => {
    const returnUrl = sessionStorage.getItem("auth_return_url") || "/";
    sessionStorage.removeItem("auth_return_url");
    navigate(returnUrl, { replace: true });
  };

  return (
    <section className="section-wrap pt-20 pb-20">
      {error ? (
        <ErrorState
          message={error}
          onRetry={handleRetry}
        />
      ) : (
        <LoadingState message="Completing Google Sign-In..." cards={1} />
      )}
    </section>
  );
};

export default AuthCallbackPage;
