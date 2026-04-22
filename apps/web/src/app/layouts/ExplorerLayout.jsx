import { Outlet } from "react-router-dom"

import { NavBar } from "../components/navigation/NavBar.jsx"
import { ExplorerBar } from "../components/explorer/ExplorerBar.jsx"

import "./Layout.css"

export function ExplorerLayout() {
  return (<div id="explorer_layout">
    <NavBar />
    <ExplorerBar />
    <main>
      <Outlet />
    </main>
  </div>);
}