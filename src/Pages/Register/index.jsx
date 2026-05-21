import { Link } from "react-router-dom";

import {
  FaGoogle,
  FaGithub,
  FaDiscord,
} from "react-icons/fa";

import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
} from "react-icons/hi";

import "./index.css";

const Register = () => {
  return (
    <section className="registerPage">
      {/* LEFT */}
      <div className="registerLeft">
        <div className="registerOverlay"></div>

        <img
          src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop"
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
            Unlock premium digital products, exclusive
            game deals and member-only rewards.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="registerRight">
        <div className="registerCard">
          {/* TOP */}
          <div className="registerTop">
            <h2>Create Account 🚀</h2>

            <p>
              Register now and start your gaming
              journey.
            </p>
          </div>

          {/* FORM */}
          <form className="registerForm">
            {/* NAME */}
            <div className="formGroup">
              <label>Full Name</label>

              <div className="inputBox">
                <HiOutlineUser className="inputIcon" />

                <input
                  type="text"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

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
              <label>Password</label>

              <div className="inputBox">
                <HiOutlineLockClosed className="inputIcon" />

                <input
                  type="password"
                  placeholder="Create password"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button className="registerBtn">
              Create Account
            </button>
          </form>

          {/* DIVIDER */}
          <div className="divider">
            <span>OR SIGN UP WITH</span>
          </div>

          {/* SOCIAL */}
          <div className="socialRegister">
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

          {/* LOGIN */}
          <div className="bottomText">
            Already have an account?

            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;