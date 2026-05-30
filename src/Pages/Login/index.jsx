import { useState, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";

import { MyContext } from "../../App";
import { login as loginRequest } from "../../services/authService";

import SocialAuthButtons from "../../components/SocialAuthButtons";

import {
  HiOutlineMail,
  HiOutlineLockClosed,
} from "react-icons/hi";

import {
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";

import "./index.css";

const Login = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formFields, setFormFields] =
    useState({
      email: "",
      password: "",
      remember: false,
    });

  /* ====================== */
  /* INPUT CHANGE */
  /* ====================== */

  const onChangeInput = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormFields({
      ...formFields,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  /* ====================== */
  /* VALIDATE */
  /* ====================== */

  const validateValue = () => {
    if (!formFields.email.trim()) {
      context.openAlertBox(
        "error",
        "Email is required"
      );

      return false;
    }

    if (
      !/\S+@\S+\.\S+/.test(
        formFields.email
      )
    ) {
      context.openAlertBox(
        "error",
        "Invalid email format"
      );

      return false;
    }

    if (!formFields.password.trim()) {
      context.openAlertBox(
        "error",
        "Password is required"
      );

      return false;
    }

    return true;
  };

  /* ====================== */
  /* LOGIN */
  /* ====================== */

  const login = async (e) => {
    e.preventDefault();

    const isValid = validateValue();

    if (!isValid) return;

    try {
      setLoading(true);

      const user = await loginRequest({
        email: formFields.email,
        password: formFields.password,
      });

      await context.login(user);
      navigate("/", { replace: true });
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
    <section className="loginPage">
      {/* LEFT */}
      <div className="loginPage__left">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
          alt="gaming"
        />

        <div className="loginPage__overlay"></div>

        <div className="loginPage__content">
          <span className="loginPage__badge">
            NEXT LEVEL GAMING
          </span>

          <h1>
            Premium Digital
            <br />
            Gaming Marketplace
          </h1>

          <p>
            Access your account and continue
            exploring premium software keys,
            gaming products and exclusive
            offers.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="loginPage__right">
        <div className="loginPage__card">
          <div className="loginPage__top">
            <h2>Welcome Back 👋</h2>

            <p>
              Login to continue your shopping
              experience.
            </p>
          </div>

          <form
            className="loginPage__form"
            onSubmit={login}
          >
            {/* EMAIL */}
            <div className="loginPage__group">
              <label>Email Address</label>

              <div className="loginPage__input">
                <HiOutlineMail className="loginPage__icon" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formFields.email}
                  onChange={onChangeInput}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="loginPage__group">
              <label>Password</label>

              <div className="loginPage__input">
                <HiOutlineLockClosed className="loginPage__icon" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter password"
                  value={formFields.password}
                  onChange={onChangeInput}
                />

                <button
                  type="button"
                  className="loginPage__showBtn"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <IoEyeOffOutline />
                  ) : (
                    <IoEyeOutline />
                  )}
                </button>
              </div>

              <Link
                to="/forgot-password"
                className="loginPage__forgot"
              >
                Forgot Password?
              </Link>
            </div>

            {/* REMEMBER */}
            <div className="loginPage__remember">
              <label className="loginPage__rememberLabel">
                <input
                  type="checkbox"
                  name="remember"
                  checked={
                    formFields.remember
                  }
                  onChange={onChangeInput}
                />

                <span>Remember me</span>
              </label>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="loginPage__submit"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="loginPage__divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <SocialAuthButtons rowClassName="loginPage__social" redirectTo="/" />

          {/* BOTTOM */}
          <div className="loginPage__bottom">
            Don’t have an account?

            <Link to="/register">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;