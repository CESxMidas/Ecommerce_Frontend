import { useContext, useState } from "react";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  HiOutlineLockClosed,
} from "react-icons/hi";

import {
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";

import {
  MdLockReset,
} from "react-icons/md";

import { MyContext } from "../../App";
import { resetPassword as resetPasswordRequest } from "../../services/authService";

import "./index.css";

const ResetPassword = () => {
  const context = useContext(MyContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  /* ========================= */
  /* STATES */
  /* ========================= */

  const [loading, setLoading] =
    useState(false);

  const [
    isPasswordShow,
    setIsPasswordShow,
  ] = useState(false);

  const [
    isConfirmPasswordShow,
    setIsConfirmPasswordShow,
  ] = useState(false);

  const [formFields, setFormFields] =
    useState({
      email: emailFromQuery,
      otp: "",
      password: "",
      confirmPassword: "",
    });

  /* ========================= */
  /* INPUT CHANGE */
  /* ========================= */

  const onChangeInput = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };

  /* ========================= */
  /* RESET PASSWORD */
  /* ========================= */

  const resetPassword = async (e) => {
    e.preventDefault();

    if (
      !formFields.password.trim()
    ) {
      context.openAlertBox(
        "error",
        "Password is required"
      );

      return;
    }

    if (
      formFields.password.length < 6
    ) {
      context.openAlertBox(
        "error",
        "Password must be at least 6 characters"
      );

      return;
    }

    if (
      !formFields.confirmPassword.trim()
    ) {
      context.openAlertBox(
        "error",
        "Please confirm password"
      );

      return;
    }

    if (
      formFields.password !==
      formFields.confirmPassword
    ) {
      context.openAlertBox(
        "error",
        "Passwords do not match"
      );

      return;
    }

    if (!context.isLogin) {
      if (!formFields.email.trim()) {
        context.openAlertBox("error", "Email is required");
        return;
      }

      if (!formFields.otp.trim()) {
        context.openAlertBox("error", "Reset code is required");
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        password: formFields.password,
        confirmPassword: formFields.confirmPassword,
      };

      if (!context.isLogin) {
        payload.email = formFields.email;
        payload.otp = formFields.otp;
      }

      await resetPasswordRequest(payload);

      context.openAlertBox(
        "success",
        "Password reset successfully"
      );

      navigate("/login");
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
    <section className="resetPage">
      <div className="resetContainer">
        <div className="resetCard">
          {/* ICON */}
          <div className="resetIcon">
            <MdLockReset />
          </div>

          {/* TOP */}
          <div className="resetTop">
            <span className="resetBadge">
              RESET PASSWORD
            </span>

            <h1>
              Create New
              <br />
              Password
            </h1>

            <p>
              Your new password must be
              different from previously
              used passwords.
            </p>
          </div>

          {/* FORM */}
          <form
            className="resetForm"
            onSubmit={resetPassword}
          >
            {!context.isLogin && (
              <>
                <div className="formGroup">
                  <label>Email Address</label>

                  <div className="inputBox">
                    <input
                      type="email"
                      name="email"
                      value={formFields.email}
                      onChange={onChangeInput}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="formGroup">
                  <label>Reset Code</label>

                  <div className="inputBox">
                    <input
                      type="text"
                      name="otp"
                      value={formFields.otp}
                      onChange={onChangeInput}
                      placeholder="Enter 6-digit code"
                    />
                  </div>
                </div>
              </>
            )}

            {/* PASSWORD */}
            <div className="formGroup">
              <label>
                New Password
              </label>

              <div className="inputBox">
                <HiOutlineLockClosed className="inputIcon" />

                <input
                  type={
                    isPasswordShow
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={
                    formFields.password
                  }
                  onChange={
                    onChangeInput
                  }
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  className="showPasswordBtn"
                  onClick={() =>
                    setIsPasswordShow(
                      !isPasswordShow
                    )
                  }
                >
                  {isPasswordShow ? (
                    <IoEyeOffOutline />
                  ) : (
                    <IoEyeOutline />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM */}
            <div className="formGroup">
              <label>
                Confirm Password
              </label>

              <div className="inputBox">
                <HiOutlineLockClosed className="inputIcon" />

                <input
                  type={
                    isConfirmPasswordShow
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    formFields.confirmPassword
                  }
                  onChange={
                    onChangeInput
                  }
                  placeholder="Confirm password"
                />

                <button
                  type="button"
                  className="showPasswordBtn"
                  onClick={() =>
                    setIsConfirmPasswordShow(
                      !isConfirmPasswordShow
                    )
                  }
                >
                  {isConfirmPasswordShow ? (
                    <IoEyeOffOutline />
                  ) : (
                    <IoEyeOutline />
                  )}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="resetBtn"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Reset Password"}
            </button>
          </form>

          {/* BOTTOM */}
          <div className="resetBottom">
            Remember password?

            <Link to="/login">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;