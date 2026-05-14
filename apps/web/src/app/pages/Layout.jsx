import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "../components/navigation/NavBar";
import { useWorkspace } from "../providers/WorkplaceProvider";
import { useAuth } from "../providers/AuthProvider";
import { NavOption } from "../domain/NavOption";

import "./Layout.css";

/**
 * Centralized nav controller
 * - no UI mode state
 * - fully derived from auth + route + workspace
 */
function createNavController({
  auth,
  workspace,
  navigate,
  location,
  switchWorkspace,
}) {
  return {
    isSelected: (navOption) => {
      switch (navOption) {
        case NavOption.FOLDER_EXPLORER:
          return (
            location.pathname.startsWith("/local") ||
            location.pathname.includes("/files")
          );

        case NavOption.SEARCH_EXPLORER:
          return workspace.explorer === "search";

        case NavOption.SETTINGS:
          return location.pathname === "/settings";

        case NavOption.USER:
          return location.pathname === "/login";

        default:
          return false;
      }
    },

    isDisabled: (navOption) => {
      // keep only truly global disabled rules here
      return false;
    },

    dispatch: (navOption) => {
      switch (navOption) {
        case NavOption.FOLDER_EXPLORER:
          switchWorkspace({
            ...workspace,
            explorer: "folder",
          });
          navigate("/local");
          break;

        case NavOption.SEARCH_EXPLORER:
          switchWorkspace({
            ...workspace,
            explorer: "search",
          });
          navigate("/local");
          break;

        case NavOption.SETTINGS:
          navigate("/settings");
          break;

        case NavOption.WORKSPACES:
          navigate(auth.isLoggedIn ? "/workspaces" : "/login");
          break;

        case NavOption.USER:
          navigate(auth.isLoggedIn ? "/logout" : "/login");
          break;

        case NavOption.MENU:
        default:
          console.warn("Unhandled nav option:", navOption);
      }
    },
  };
}

export function WorkspaceLayout() {
  const { auth } = useAuth();
  const { workspace, switchWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();

  const navController = createNavController({
    auth,
    workspace,
    navigate,
    location,
    switchWorkspace,
  });

  return (
    <main id="workspace_layout">
      <NavBar navController={navController} />
      <Outlet />
    </main>
  );
}

export function Layout() {

  return (
    <WorkspaceLayout>
      <Outlet />
    </WorkspaceLayout>);
}