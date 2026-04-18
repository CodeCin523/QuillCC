import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../pages/layout";

import "./app.css";
import "./reset.css";

const router = createBrowserRouter([{
  path: "/",
  element: <RootLayout />,
  errorPath: <></>,
  children: [
    { path: "", element: <></> }
  ]
}]);

export default function App() {
  return <RouterProvider router={router} />;
}