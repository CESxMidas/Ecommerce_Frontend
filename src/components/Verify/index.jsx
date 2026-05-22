import { useState } from "react";

import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";

import { Link } from "react-router-dom";



import "./index.css";
import OTPBox from "../OTPBox";

const Verify = () => {
  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const verifyOTP = () => {
    const otpValue = otp.join("");

    console.log("OTP => ", otpValue);

    // API VERIFY
  };

  const resendOTP = () => {
    console.log("Resend OTP");
  };

  return (
    <section className="verifyPage">
      <div className="verifyContainer">
        {/* CARD */}
        <div className="verifyCard">
          {/* ICON */}
          <div className="verifyIcon">
            <MdOutlineMarkEmailRead />
          </div>

          {/* CONTENT */}
          <div className="verifyContent">
            <span className="verifyBadge">
              EMAIL VERIFICATION
            </span>

            <h1>
              Verify Your

              Email Address
            </h1>

            <p>
              We’ve sent a 6-digit verification
              code to your email address. Enter
              the code below to verify your
              account.
            </p>
          </div>

          {/* EMAIL */}
          <div className="verifyEmailBox">
            <span>Email sent to</span>

            <h4>
              hoangdohuy0907@gmail.com
            </h4>
          </div>

          {/* OTP */}
          <OTPBox otp={otp} setOtp={setOtp} />

          {/* ACTIONS */}
          <div className="verifyActions">
            <button
              className="verifyBtn"
              onClick={verifyOTP}
            >
              Verify Account
            </button>

            <button
              className="resendBtn"
              onClick={resendOTP}
            >
              <FiRefreshCcw />
              Resend Code
            </button>
          </div>

          {/* BOTTOM */}
          <div className="verifyBottom">
            Wrong email?

            <Link to="/login">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verify;