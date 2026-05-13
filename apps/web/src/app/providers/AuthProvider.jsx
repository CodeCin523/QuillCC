import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  token: "",
  user: null,
  isLoggedIn: false,
  logIn: () => { },
  logOut: () => { }
});

export function AuthProvider({ token = "", user = null, logIn = () => { }, logOut = () => { }, children }) {
  const [auth, setAuth] = useState({
    token: token,
    user: user,
    isLoggedIn: token !== "",
    logIn: logIn,
    logOut: logOut,
  });

  const switchAuth = (token, user) => {
    setAuth({
      ...auth,
      token: token,
      user: user,
      isLoggedIn: token !== ""
    });
  };

  return (
    <AuthContext.Provider value={{ auth, switchAuth }}>
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