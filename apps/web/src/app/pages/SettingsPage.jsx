// SettingsPage.jsx
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider.jsx";
import { apiRequest } from "../../shared/domain/api.js";
import { useTranslation } from "react-i18next";

import "./Page.css";

export function SettingsPage() {
  const { t } = useTranslation();
  const { auth, logIn } = useAuth();
  const [username, setUsername] = useState(auth.user?.username || "");
  const [email, setEmail] = useState(auth.user?.email || "");
  const [logo, setLogo] = useState(auth.user?.logo || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const updatedUser = await apiRequest("/api/users/me", {
        method: "PATCH",
        body: { username, email, logo },
        token: auth.token,
      });
      logIn({ token: auth.token, user: updatedUser });
      setSuccess(t("update") + " " + t("successfully"));
    } catch (err) {
      setError(err.message);
    }
  };

return (
  <div className="page-center">
    <div className="form-card">
      <h1 className="form-title">{t("settings")}</h1>

      {error && <div className="form-error">{error}</div>}

      {success && (
        <div className="form-success">
          {success}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder={t("logoUrl")}
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
        />

        <button type="submit">
          {t("update")}
        </button>
      </form>
    </div>
  </div>
);
}