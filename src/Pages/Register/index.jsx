import { useState, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";

import SocialAuthButtons from "../../components/SocialAuthButtons";

import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
} from "react-icons/hi";

import { MyContext } from "../../App";
import { register as registerRequest } from "../../services/authService";

import "./index.css";

const Register = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formFields, setFormFields] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  /* ====================== */
  /* INPUT CHANGE */
  /* ====================== */

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  /* ====================== */
  /* VALIDATE */
  /* ====================== */

  const validateValue = () => {
    if (!formFields.name.trim()) {
      context.openAlertBox(
        "error",
        "Full name is required"
      );

      return false;
    }

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

    if (
      formFields.password.length < 6
    ) {
      context.openAlertBox(
        "error",
        "Password must be at least 6 characters"
      );

      return false;
    }

    return true;
  };

  /* ====================== */
  /* REGISTER */
  /* ====================== */

  const register = async (e) => {
    e.preventDefault();

    const isValid = validateValue();

    if (!isValid) return;

    try {
      setLoading(true);

      const result = await registerRequest({
        name: formFields.name,
        email: formFields.email,
        password: formFields.password,
      });

      context.openAlertBox(
        "success",
        result.message || "Register successful"
      );

      navigate(
        `/verifyAccount?email=${encodeURIComponent(formFields.email)}`,
        {
          state: { email: formFields.email },
        }
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
    <section className="registerPage">
      {/* LEFT */}
      <div className="registerLeft">
        <div className="registerOverlay"></div>

        <img
          src="/images/bypass/snake-app.png"
          alt=""
        />

        <div className="registerLeftContent">
          <span className="registerBadge">
            JOIN THE COMMUNITY
          </span>

          <h1>
            Create Your
            <br />
            Gaming Account
          </h1>

          <p>
            Unlock premium digital
            products, exclusive game
            deals and member-only
            rewards.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="registerRight">
        <div className="registerCard">
          {/* TOP */}
          <div className="registerTop">
            <h2>
              Create Account 🚀
            </h2>

            <p>
              Register now and start
              your gaming journey.
            </p>
          </div>

          {/* FORM */}
          <form
            className="registerForm"
            onSubmit={register}
          >
            {/* NAME */}
            <div className="formGroup">
              <label>
                Full Name
              </label>

              <div className="inputBox">
                <HiOutlineUser className="inputIcon" />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={
                    formFields.name
                  }
                  onChange={
                    onChangeInput
                  }
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="formGroup">
              <label>
                Email Address
              </label>

              <div className="inputBox">
                <HiOutlineMail className="inputIcon" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={
                    formFields.email
                  }
                  onChange={
                    onChangeInput
                  }
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="formGroup">
              <label>
                Password
              </label>

              <div className="inputBox">
                <HiOutlineLockClosed className="inputIcon" />

                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={
                    formFields.password
                  }
                  onChange={
                    onChangeInput
                  }
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="registerBtn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="divider">
            <span>
              OR SIGN UP WITH
            </span>
          </div>

          <SocialAuthButtons rowClassName="socialRegister" redirectTo="/" />

          {/* LOGIN */}
          <div className="bottomText">
            Already have an account?

            <Link to="/login">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
