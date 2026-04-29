import { Outlet } from "react-router-dom"

import { ExplorerBar } from "../components/explorer/ExplorerBar";
import { NavBar } from "../components/navigation/NavBar";

import "./Layout.css"

export function WorkspaceLayout({
    children
}) {
    return (<>
        <NavBar />
        <ExplorerBar />
        <main>
            {children ? children : <Outlet />}
        </main>
    </>)
}