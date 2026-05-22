import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { MyContext } from "../../App";

import {
  FaGoogle,
  FaGithub,
  FaDiscord,
} from "react-icons/fa";

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
  const navigate = useNavigate();

  const context = useContext(MyContext);

  const [isPasswordShow, setIsPasswordShow] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formFields, setFormFields] =
    useState({
      email: "",
      password: "",
      remember: false,
    });

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

  const login = async (e) => {
    e.preventDefault();

    const isValid = validateValue();

    if (!isValid) return;

    try {
      setLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      context.openAlertBox(
        "success",
        "Login successful"
      );

      navigate("/");
    } catch (error) {
      console.log(error);
      
      context.openAlertBox(
        "error",
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="loginPage">
      {/* LEFT */}
      <div className="loginLeft">
        <div className="loginOverlay"></div>

        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
          alt="gaming"
        />

        <div className="loginLeftContent">
          <span className="loginBadge">
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
      <div className="loginRight">
        <div className="loginCard">
          <div className="loginTop">
            <h2>Welcome Back 👋</h2>

            <p>
              Login to continue your shopping
              experience.
            </p>
          </div>

          <form
            className="loginForm"
            onSubmit={login}
          >
            {/* EMAIL */}
            <div className="formGroup">
              <label>Email Address</label>

              <div className="inputBox">
                <HiOutlineMail className="inputIcon" />

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
            <div className="formGroup">
              <div className="passwordLabel">
                <label>Password</label>

                <Link
                  to="/forgot-password"
                  className="forgotBtn"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="inputBox">
                <HiOutlineLockClosed className="inputIcon" />

                <input
                  type={
                    isPasswordShow
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

            {/* REMEMBER */}
            <div className="rememberBox">
              <div className="rememberLeft">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={
                    formFields.remember
                  }
                  onChange={onChangeInput}
                />

                <label htmlFor="remember">
                  Remember me
                </label>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="loginBtn"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="divider">
            <span>OR CONTINUE WITH</span>
          </div>

          {/* SOCIAL */}
          <div className="socialLogin">
            <button type="button">
              <FaGoogle />
            </button>

            <button type="button">
              <FaGithub />
            </button>

            <button type="button">
              <FaDiscord />
            </button>
          </div>

          {/* BOTTOM */}
          <div className="bottomText">
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