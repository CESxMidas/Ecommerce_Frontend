import { useContext, useState } from "react";

import { Link } from "react-router-dom";

import { HiOutlineMail } from "react-icons/hi";

import { MdOutlineLockReset } from "react-icons/md";

import { MyContext } from "../../App";

import "./index.css";

const ForgotPassword = () => {
  const context = useContext(MyContext);

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

      // FAKE API
      await new Promise((resolve) => setTimeout(resolve, 1200));

      context.openAlertBox("success", "Password reset email sent");

      console.log(email);
    } catch (error) {
      console.log(error);

      context.openAlertBox("error", "Something went wrong");
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
