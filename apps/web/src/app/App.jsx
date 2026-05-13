import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./providers/AuthProvider.jsx";

import { LocalWorkspace } from "./pages/LocalWorkspace.jsx";
import { RemoteWorkspace } from "./pages/RemoteWorkspace.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { LogoutPage } from "./pages/LogoutPage.jsx";

import { Layout } from "./pages/Layout.jsx"

import "./App.css"

// ---------------- Guest Router ----------------
const guestRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Navigate to="/local" replace /> },
      {
        path: "local",
        element: <LocalWorkspace />,
        children: [
          { path: "files/:fileId" },
          { path: "*" },
        ],
      },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "*", element: <Navigate to="/local" replace /> },
    ],
  },
]);

// ---------------- Authenticated Router ----------------
const authRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "remote/:workspaceId",
        element: <RemoteWorkspace />,
        children: [
          { path: "files/:fileId", element: <RemoteWorkspace /> },
          { path: "*", element: <div>Remote Not Found</div> },
        ],
      },
      { path: "settings", element: <SettingsPage /> },
      { path: "logout", element: <LogoutPage /> },
      { path: "*", element: <Navigate to="/remote/default" replace /> },
    ],
  },
]);

// ---------------- AppRouter ----------------
function AppRouter() {
  const { auth } = useAuth();

  // Choose router based on login state
  const router = auth.isLoggedIn ? authRouter : guestRouter;

  return <RouterProvider router={router} />;
}

// ---------------- App Component ----------------
export function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}