import { Outlet, useNavigate } from "react-router-dom"
import { NavBar } from "../components/navigation/NavBar.jsx"

import "./Layout.css"

export function NavOnlyLayout({ children }) {
  const navigate = useNavigate();

  const navOnlyNavController = {
    isSelected: (navAction) => {
      return true;
    },
    dispatch: (navAction) => {
      alert("not implemented");
    },
  };

  return (<>
    <NavBar navController={navOnlyNavController} />
    <main>
      {children ? children : <Outlet />}
    </main>
  </>)
}