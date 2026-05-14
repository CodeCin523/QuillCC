// AuthProvider.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: "",
    user: null,
    isLoggedIn: false,
  });

  // logIn sets token and user
  const logIn = ({ token, user }) => {
    setAuth({
      token,
      user,
      isLoggedIn: true,
    });
  };

  // logOut clears everything
  const logOut = () => {
    setAuth({
      token: "",
      user: null,
      isLoggedIn: false,
    });
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