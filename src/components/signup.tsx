import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { countryCodes } from "../utils/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../components/user-context";
import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://0.0.0.0:9000/chat-app";

interface SignUpForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpForm>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [userCountryCode, setUserCountryCode] = useState<string>("+91");
  const [touched, setTouched] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setPhoneNumber, setCountryCode } = useUser();

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserCountryCode(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phoneNumber ||
      !validatePhoneNumber(formData.phoneNumber)
    ) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/signup`,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
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
        setPhoneNumber(formData.phoneNumber);
        setCountryCode(userCountryCode);
        toast.success("Signup successful!");
        navigate("/verify-otp");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong during signup";
      toast.error(errorMessage);
    }
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
          Sign Up
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                touched && !formData.firstName ? "border-red-500" : ""
              }`}
            />
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                touched && !formData.lastName ? "border-red-500" : ""
              }`}
            />
          </div>
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
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              maxLength={10}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                touched &&
                (!formData.phoneNumber ||
                  !validatePhoneNumber(formData.phoneNumber))
                  ? "border-red-500"
                  : ""
              }`}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
