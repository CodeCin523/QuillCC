import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { LocalWorkspace } from "./pages/LocalWorkspace.jsx";
import { RemoteWorkspace } from "./pages/RemoteWorkspace.jsx";
import { NavOnlyLayout } from "./layouts/NavOnlyLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/local",
    element: <LocalWorkspace />,
    children: [
      { path: "*" },
      { path: "files/:fileId" }
    ],
  },
  {
    path: "/remote/:workspaceId",
    element: <RemoteWorkspace />,
    children: [
      { path: "*" },
      { path: "files/:fileId" }
    ],
  },
  {
    path: "*",
    element: <NavOnlyLayout />
  }
]);

export  function App() {
  return <RouterProvider router={router} />;
}