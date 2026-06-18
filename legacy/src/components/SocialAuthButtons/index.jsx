import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaGoogle, FaGithub, FaDiscord } from "react-icons/fa";

import { MyContext } from "../../App";
import { googleLogin } from "../../services/authService";

import "./index.css";

const SocialAuthButtons = ({
  rowClassName = "loginPage__social",
  redirectTo = "/",
}) => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleSuccess = useCallback(
    async (credentialResponse) => {
      if (!credentialResponse?.credential) {
        context.openAlertBox("error", "Google token was not received");
        return;
      }

      try {
        setLoading(true);

        const user = await googleLogin(
          credentialResponse.credential,
          clientId,
        );
        await context.login(user);
        navigate(redirectTo, { replace: true });
      } catch (error) {
        context.openAlertBox(
          "error",
          error.message || "Google sign-in failed",
        );
      } finally {
        setLoading(false);
      }
    },
    [clientId, context, navigate, redirectTo],
  );

  const handleGoogleError = useCallback(() => {
    context.openAlertBox(
      "error",
      "Google sign-in was cancelled or failed",
    );
  }, [context]);

  const handleComingSoon = () => {
    context.openAlertBox("warning", "This feature is coming soon");
  };

  return (
    <div
      className={`socialAuthRow ${rowClassName}${loading ? " socialAuthRow--loading" : ""}`}
    >
      <div className="socialAuthGoogle">
        {clientId ? (
          <GoogleLogin
            type="icon"
            shape="circle"
            theme="filled_black"
            size="large"
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        ) : (
          <button
            type="button"
            className="socialAuthIconBtn"
            onClick={() =>
              context.openAlertBox(
                "error",
                "VITE_GOOGLE_CLIENT_ID is not configured",
              )
            }
            aria-label="Google"
          >
            <FaGoogle />
          </button>
        )}
      </div>

      <button
        type="button"
        className="socialAuthIconBtn"
        onClick={handleComingSoon}
        aria-label="GitHub"
      >
        <FaGithub />
      </button>

      <button
        type="button"
        className="socialAuthIconBtn"
        onClick={handleComingSoon}
        aria-label="Discord"
      >
        <FaDiscord />
      </button>
    </div>
  );
};

export default SocialAuthButtons;
