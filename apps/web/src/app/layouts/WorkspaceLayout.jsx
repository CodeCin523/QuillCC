import { Outlet } from "react-router-dom"

import { ExplorerBar } from "../components/explorer/ExplorerBar";
import { NavBar } from "../components/navigation/NavBar";
import { StorageProvider } from "../providers/StorageProvider";

import "./Layout.css"

export function WorkspaceLayout({
  storageAdapter, children
}) {
  return (<StorageProvider storageAdapter={storageAdapter}>
    <NavBar />
    <ExplorerBar />
    <main>
      {children ? children : <Outlet />}
    </main>
  </StorageProvider>);
}