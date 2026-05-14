// SettingsPage.jsx
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider.jsx";
import { apiRequest } from "../../shared/domain/api.js";
import { useTranslation } from "react-i18next";

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
    <div>
      <h1>{t("settings")}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder={t("logoUrl")}
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
        />
        <br />
        <button type="submit">{t("update")}</button>
      </form>
    </div>
  );
}