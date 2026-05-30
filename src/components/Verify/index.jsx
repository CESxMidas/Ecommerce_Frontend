import { useContext, useState } from "react";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { MyContext } from "../../App";
import {
  resendVerification,
  verifyAccount,
} from "../../services/authService";

import "./index.css";
import OTPBox from "../OTPBox";

const Verify = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const email =
    searchParams.get("email") ||
    location.state?.email ||
    "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const verifyOTP = async () => {
    const code = otp.join("").trim();

    if (!email) {
      context.openAlertBox("error", "Thiếu email");
      return;
    }

    if (code.length !== 6) {
      context.openAlertBox("error", "Nhập đủ 6 số OTP");
      return;
    }

    try {
      setLoading(true);

      await verifyAccount({ email, otp: code });

      context.openAlertBox("success", "Xác minh thành công");
      navigate("/login");
    } catch (error) {
      context.openAlertBox(
        "error",
        error.message || "Mã không đúng hoặc đã hết hạn"
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!email) {
      context.openAlertBox("error", "Thiếu email");
      return;
    }

    try {
      setLoading(true);

      const result = await resendVerification(email);

      context.openAlertBox(
        "success",
        result.message || "Đã gửi lại mã qua Gmail"
      );
    } catch (error) {
      context.openAlertBox(
        "error",
        error.message || "Không gửi được email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="verifyPage">
      <div className="verifyContainer">
        <div className="verifyCard">
          <div className="verifyIcon">
            <MdOutlineMarkEmailRead />
          </div>

          <div className="verifyContent">
            <span className="verifyBadge">
              EMAIL VERIFICATION
            </span>

            <h1>
              Xác minh email
            </h1>

            <p>
              Mã 6 số đã được gửi tới Gmail của bạn. Mở app Gmail trên điện
              thoại hoặc máy tính, kiểm tra <strong>Hộp thư đến</strong> và
              cả <strong>Spam</strong>, rồi nhập mã bên dưới.
            </p>
          </div>

          <div className="verifyEmailBox">
            <span>Gửi tới</span>

            <h4>{email || "—"}</h4>
          </div>

          <OTPBox otp={otp} setOtp={setOtp} />

          <div className="verifyActions">
            <button
              className="verifyBtn"
              onClick={verifyOTP}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Xác minh"}
            </button>

            <button
              className="resendBtn"
              onClick={resendOTP}
              disabled={loading}
            >
              <FiRefreshCcw />
              Gửi lại mã qua Gmail
            </button>
          </div>

          <div className="verifyBottom">
            Sai email?
            <Link to="/login">Về đăng nhập</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verify;
