import { Outlet } from "react-router-dom"

import NavBar from "../components/navbar/navbar"

import "./layout.css"

export default function RootLayout() {
  return (<div id="root_layout" className="directory-collapsed">
    <NavBar />
    <main>
      <Outlet />
    </main>
  </div>);
}