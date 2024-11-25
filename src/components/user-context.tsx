import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface UserContextType {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  countryCode: string;
  setCountryCode: (countryCode: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>(
    () => localStorage.getItem("userPhone") || ""
  );
  const [countryCode, setCountryCode] = useState<string>(
    () => localStorage.getItem("countryCode") || ""
  );

  useEffect(() => {
    localStorage.setItem("userPhone", phoneNumber);
  }, [phoneNumber]);

  useEffect(() => {
    localStorage.setItem("countryCode", countryCode);
  }, [countryCode]);

  const value = {
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
