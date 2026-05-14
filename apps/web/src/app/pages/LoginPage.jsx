// LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";
import { apiRequest } from "../../shared/domain/api.js";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import "./Page.css";

export function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { logIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/api/login", {
        method: "POST",
        body: { email, password },
      });
      logIn({ token: data.token, user: data.user });
      navigate("/remote/default"); // redirect after login
    } catch (err) {
      setError(err.message);
    }
  };

return (
  <div className="page-center">
    <div className="form-card">
      <h1 className="form-title">{t("login")}</h1>

      {error && <div className="form-error">{error}</div>}

      <form className="form" onSubmit={handleSubmit}>
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

        <button type="submit">
          {t("submit")}
        </button>
      </form>
      <p className="form-footer">
        {t("noAccount")}{" "}
        <Link to="/register" className="form-link">
          {t("register")}
        </Link>
      </p>
    </div>
  </div>
);
}