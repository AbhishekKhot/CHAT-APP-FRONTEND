import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/signup";
import SignIn from "./components/signin";
import VerifyOTP from "./components/verify-otp";
import Chats from "./components/chats";
import NotFound from "./components/not-found";
import { UserProvider } from "./components/user-context";
import { useUser } from "./components/user-context";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { phoneNumber, countryCode } = useUser();

  if (!phoneNumber || !countryCode) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/verify-otp"
            element={
              <ProtectedRoute>
                <VerifyOTP />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
