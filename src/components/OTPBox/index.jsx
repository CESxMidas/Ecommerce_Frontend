import { useRef } from "react";

import "./index.css";

const OTPBox = ({ otp, setOtp }) => {
  const inputRefs = useRef([]);

  /* ========================= */
  /* INPUT CHANGE */
  /* ========================= */

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.substring(value.length - 1);

    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  /* ========================= */
  /* BACKSPACE */
  /* ========================= */

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  /* ========================= */
  /* PASTE OTP */
  /* ========================= */

  const handlePaste = (e) => {
    e.preventDefault();

    const pasteData = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pasteData)) return;

    const pasteArray = pasteData.slice(0, 6).split("");

    const newOtp = [...otp];

    pasteArray.forEach((num, index) => {
      newOtp[index] = num;
    });

    setOtp(newOtp);
    inputRefs.current[pasteArray.length - 1]?.focus();
  };

  return (
    <div className="otpWrapper">
      {otp.map((item, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength="1"
          value={item}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="otpInput"
        />
      ))}
    </div>
  );
};

export default OTPBox;
