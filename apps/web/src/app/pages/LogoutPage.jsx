// LogoutPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";
import { useTranslation } from "react-i18next";

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

  return <p>{t("loggingOut")}</p>;
}