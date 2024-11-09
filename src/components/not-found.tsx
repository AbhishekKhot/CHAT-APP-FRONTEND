import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          404 - Page Not Found
        </h2>
        <p className="text-center text-gray-600">
          Oops! The page you're looking for does not exist.
        </p>
        <div className="text-center mt-4">
          <a href="/signup" className="text-blue-500 hover:text-blue-700">
            Go to Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
