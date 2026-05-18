// AuthProvider.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "auth";

function loadAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {
        token: "",
        user: null,
        isLoggedIn: false,
      };
    }

    return JSON.parse(stored);
  } catch {
    return {
      token: "",
      user: null,
      isLoggedIn: false,
    };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuth);

  // logIn sets token and user
  const logIn = ({ token, user }) => {
    const newAuth = {
      token,
      user,
      isLoggedIn: true,
    };

    setAuth(newAuth);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAuth));
  };

  // logOut clears everything
  const logOut = () => {
    const clearedAuth = {
      token: "",
      user: null,
      isLoggedIn: false,
    };

    setAuth(clearedAuth);

    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ auth, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}