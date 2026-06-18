"use client";

import { useRef } from "react";

type OTPBoxProps = {
  otp: string[];
  setOtp: (value: string[]) => void;
};

export default function OTPBox({ otp, setOtp }: OTPBoxProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (Number.isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasteData = event.clipboardData.getData("text").trim();

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
    <div className="flex justify-center gap-3">
      {otp.map((item, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={item}
          onChange={(event) => handleChange(event.target.value, index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onPaste={handlePaste}
          className="h-[62px] w-[58px] rounded-[18px] border border-keyshop-line bg-white/[0.03] text-center text-xl font-bold text-white outline-none transition focus:border-keyshop-blue focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
        />
      ))}
    </div>
  );
}
