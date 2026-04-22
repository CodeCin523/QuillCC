import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ExplorerLayout } from "./layouts/ExplorerLayout.jsx";

import "./App.css";

const router = createBrowserRouter([{
  path: "/",
  element: <ExplorerLayout />,
  errorPath: <></>,
  children: [
    { path: "*", element: <></> }
  ]
}]);

export  function App() {
  return <RouterProvider router={router} />;
}