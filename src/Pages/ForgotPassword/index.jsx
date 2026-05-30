import { useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { HiOutlineMail } from "react-icons/hi";

import { MdOutlineLockReset } from "react-icons/md";

import { MyContext } from "../../App";
import { forgotPassword as forgotPasswordRequest } from "../../services/authService";

import "./index.css";

const ForgotPassword = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  /* ========================= */
  /* SUBMIT */
  /* ========================= */

  const forgotPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      context.openAlertBox("error", "Email is required");

      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      context.openAlertBox("error", "Invalid email format");

      return;
    }

    try {
      setLoading(true);

      const result = await forgotPasswordRequest(email);

      context.openAlertBox(
        "success",
        result.message || "Password reset code sent"
      );

      navigate(
        `/reset-password?email=${encodeURIComponent(email)}`
      );
    } catch (error) {
      context.openAlertBox(
        "error",
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="forgotPage">
      <div className="forgotContainer">
        <div className="forgotCard">
          {/* ICON */}
          <div className="forgotIcon">
            <MdOutlineLockReset />
          </div>

          {/* TOP */}
          <div className="forgotTop">
            <span className="forgotBadge">PASSWORD RECOVERY</span>

            <h1>
              Forgot Your

              Password?
            </h1>

            <p>
              Enter your email address and we’ll send you a password reset link.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={forgotPassword} className="forgotForm">
            <div className="formGroup">
              <label>Email Address</label>

              <div className="inputBox">
                <HiOutlineMail className="inputIcon" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="forgotBtn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* BOTTOM */}
          <div className="forgotBottom">
            Remember password?
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
