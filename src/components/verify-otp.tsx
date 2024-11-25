import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useUser } from "../components/user-context";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://0.0.0.0:9000/chat-app";

const VerifyOTP: React.FC = () => {
  const { phoneNumber, countryCode } = useUser();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  if (!phoneNumber || !countryCode) {
    return <Navigate to="/signup" replace />;
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid OTP");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        phone_number: phoneNumber,
        country_code: countryCode,
        otp: otp,
      });

      if (response.status === 200) {
        toast.success("Phone number verified successfully!");
        navigate("/chat");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Verify OTP
        </h2>
        <p className="text-center text-gray-600">
          Enter the OTP sent to {phoneNumber}
        </p>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-2 text-center text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Verify OTP
          </button>
        </form>
        <div className="text-center">
          <button
            onClick={() => {
              /* Add resend OTP logic here */
            }}
            className="text-blue-500 hover:text-blue-600"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
