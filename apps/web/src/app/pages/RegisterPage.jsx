// RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";
import { apiRequest } from "../../shared/domain/api.js";
import { useTranslation } from "react-i18next";

import "./Page.css";

export function RegisterPage() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logo, setLogo] = useState("");
  const [error, setError] = useState("");

  const { logIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/api/register", {
        method: "POST",
        body: { username, email, password, logo },
      });
      logIn({ token: data.token, user: data.user });
      navigate("/remote/default"); // redirect after registration
    } catch (err) {
      setError(err.message);
    }
  };

return (
  <div className="page-center">
    <div className="form-card">
      <h1 className="form-title">{t("register")}</h1>

      {error && <div className="form-error">{error}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder={t("logoUrl")}
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
        />

        <button type="submit">
          {t("submit")}
        </button>
      </form>
    </div>
  </div>
);
}