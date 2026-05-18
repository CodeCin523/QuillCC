import { Outlet } from "react-router-dom";
import { NavBar } from "../components/navigation/NavBar";
import "./Layout.css";

/**
 * Layout used for pages that include workspace navigation
 */
export function WorkspaceLayout({children}) {
  return (
    <main id="workspace_layout">
      <NavBar />      {/* NavBar now fully self-contained */}
      {children}
      {/* <Outlet />      {/* Child routes rendered here */}
    </main>
  );
}

/**
 * General layout component, currently just wraps WorkspaceLayout
 * Could be extended for non-workspace pages if needed
 */
export function Layout() {
  return (
    <WorkspaceLayout>
      <Outlet />      {/* Nested routes rendered here */}
    </WorkspaceLayout>
  );
}