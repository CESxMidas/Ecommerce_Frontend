import { useContext, useState } from "react";

import {
  MdOutlineMarkEmailRead,
} from "react-icons/md";

import { FiRefreshCcw } from "react-icons/fi";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import OTPBox from "../../components/OTPBox";

import { MyContext } from "../../App";

import "./index.css";

const Verify = () => {
  const context = useContext(MyContext);

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  /* ========================= */
  /* VERIFY OTP */
  /* ========================= */

  const verifyOTP = async () => {
    const otpValue = otp.join("");

    if (otpValue.length < 6) {
      context.openAlertBox(
        "error",
        "Please enter full OTP code"
      );

      return;
    }

    try {
      setLoading(true);

      console.log("OTP => ", otpValue);

      // FAKE API
      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      context.openAlertBox(
        "success",
        "Email verified successfully"
      );

      navigate("/");
    } catch (error) {
      console.log(error);
      
      context.openAlertBox(
        "error",
        "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ========================= */
  /* RESEND OTP */
  /* ========================= */

  const resendOTP = () => {
    context.openAlertBox(
      "success",
      "Verification code resent"
    );
  };

  return (
    <section className="verifyPage">
      <div className="verifyContainer">
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
              <br />
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
          <OTPBox
            otp={otp}
            setOtp={setOtp}
          />

          {/* ACTIONS */}
          <div className="verifyActions">
            <button
              className="verifyBtn"
              onClick={verifyOTP}
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify Account"}
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