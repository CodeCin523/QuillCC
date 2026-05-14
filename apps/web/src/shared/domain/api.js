import { SERVER_URL } from "./url.js";
import { useAuth } from "../../app/providers/AuthProvider"; // adjust path if needed

export async function apiRequest(endpoint, { method = "GET", body = null, token = null } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${SERVER_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "API Error");
  }

  return res.json();
}