
import { Link } from "react-router-dom";
import { FaGoogle, FaGithub, FaDiscord } from "react-icons/fa";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

import "./index.css";

const Login = () => {
  return (
    <section className="loginPage">
      {/* LEFT SIDE */}
      <div className="loginLeft">
        <div className="loginOverlay"></div>

        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
          alt=""
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
            Access your account and continue exploring
            premium software keys, gaming products and
            exclusive offers.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="loginRight">
        <div className="loginCard">
          <div className="loginTop">
            <h2>Welcome Back 👋</h2>

            <p>
              Login to continue your shopping experience.
            </p>
          </div>

          {/* FORM */}
          <form className="loginForm">
            {/* EMAIL */}
            <div className="formGroup">
              <label>Email Address</label>

              <div className="inputBox">
                <HiOutlineMail className="inputIcon" />

                <input
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="formGroup">
              <div className="passwordLabel">
                <label>Password</label>

                <Link to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <div className="inputBox">
                <HiOutlineLockClosed className="inputIcon" />

                <input
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* REMEMBER */}
            <div className="rememberBox">
              <div className="rememberLeft">
                <input type="checkbox" id="remember" />

                <label htmlFor="remember">
                  Remember me
                </label>
              </div>
            </div>

            {/* BUTTON */}
            <button className="loginBtn">
              Sign In
            </button>
          </form>

          {/* DIVIDER */}
          <div className="divider">
            <span>OR CONTINUE WITH</span>
          </div>

          {/* SOCIAL */}
          <div className="socialLogin">
            <button>
              <FaGoogle />
            </button>

            <button>
              <FaGithub />
            </button>

            <button>
              <FaDiscord />
            </button>
          </div>

          {/* REGISTER */}
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