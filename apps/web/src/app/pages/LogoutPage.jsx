// LogoutPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";
import { useTranslation } from "react-i18next";

import "./Page.css";

export function LogoutPage() {
  const { t } = useTranslation();
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmed = window.confirm(t("logoutConfirmation"));
    if (confirmed) {
      logOut();
      navigate("/login");
    } else {
      navigate("/"); // go back if user cancels
    }
  }, []);

  return (
  <div className="page-center">
    <div className="form-card">
      <p className="logout-text">
        {t("loggingOut")}
      </p>
    </div>
  </div>
);
}