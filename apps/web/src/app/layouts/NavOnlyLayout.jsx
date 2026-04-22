import { Outlet } from "react-router-dom"

import { NavBar } from "../components/navigation/NavBar.jsx"

import "./Layout.css"

export  function NavOnlyLayout() {
  return (<div id="nav_only_layout">
    <NavBar />
    <main>
      <Outlet />
    </main>
  </div>);
}