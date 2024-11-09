import React, { useState, useEffect } from "react";

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(30);
  const [canResendOtp, setCanResendOtp] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (timer === 0) {
      setCanResendOtp(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp === "") {
      setError("OTP cannot be empty.");
      return;
    }
    if (otp.length !== 6 || isNaN(Number(otp))) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    if (otp === "123456") {
      alert("OTP verified successfully!");
    } else {
      setError("Invalid OTP.");
    }
  };

  const handleResendOtp = () => {
    if (canResendOtp) {
      setTimer(60);
      setCanResendOtp(false);
      alert("OTP has been resent.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Verify OTP
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleVerifyOtp}>
          <div>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={6}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Verify
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600">
          {canResendOtp ? (
            <button
              onClick={handleResendOtp}
              className="text-blue-500 hover:text-blue-700"
            >
              Resend OTP
            </button>
          ) : (
            <span>Resend OTP in {timer} seconds</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
