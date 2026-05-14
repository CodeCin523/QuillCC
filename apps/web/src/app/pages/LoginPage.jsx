// LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";
import { apiRequest } from "../../shared/domain/api.js";
import { useTranslation } from "react-i18next";

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
    <div>
      <h1>{t("login")}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">{t("submit")}</button>
      </form>
    </div>
  );
}