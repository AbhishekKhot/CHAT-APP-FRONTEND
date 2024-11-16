import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { countryCodes } from "../utils/constants";

const SignIn: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length !== 10 || isNaN(Number(phoneNumber))) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    console.log(`Country Code: ${countryCode}, Phone Number: ${phoneNumber}`);
    navigate("/verify-otp");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Enter Phone Number
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center">
            <select
              value={countryCode}
              onChange={handleCountryCodeChange}
              className="mr-2 border rounded-lg text-lg w-[120px] h-[42px] p-1.5" // {{ edit_5 }}
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
              value={phoneNumber}
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
