import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { countryCodes } from "../utils/constants";
import { useUser } from "../components/user-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://0.0.0.0:9000/chat-app";

const SignIn: React.FC = () => {
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>("");
  const [userCountryCode, setUserCountryCode] = useState<string>("+91");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setPhoneNumber, setCountryCode } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPhoneNumber(e.target.value);
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserCountryCode(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userPhoneNumber.length !== 10 || isNaN(Number(userPhoneNumber))) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/signup`,
        {
          phone_number: userPhoneNumber,
          country_code: userCountryCode,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setPhoneNumber(userPhoneNumber);
        setCountryCode(userCountryCode);
        toast.success("Signin successful!");
        navigate("/verify-otp");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong during signup";
      toast.error(errorMessage);
    }
    navigate("/verify-otp");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Enter Phone Number
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center">
            <select
              value={userCountryCode}
              onChange={handleCountryCodeChange}
              className="mr-2 border rounded-lg text-lg w-[120px] h-[42px] p-1.5"
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={userPhoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={10}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
