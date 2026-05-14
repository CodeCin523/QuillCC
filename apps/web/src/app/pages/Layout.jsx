import { Outlet, useNavigate } from "react-router-dom";
import { NavBar } from "../components/navigation/NavBar";
import { useWorkspace, WorkspaceProvider } from "../providers/WorkplaceProvider";
import { useAuth } from "../providers/AuthProvider";
import { NavOption } from "../domain/NavOption";
import { useState } from "react";

import "./Layout.css"

function WorkspaceLayout({ children }) {
  const { auth } = useAuth();
  const { workspace, switchWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const [isInWorkspace, setIsInWorkspace] = useState(true);

  let guestController = {
    isSelected: (navOption) => {
      switch (navOption) {
        case NavOption.FOLDER_EXPLORER:
          return isInWorkspace && workspace.explorer === "folder";
        case NavOption.SEARCH_EXPLORER:
          return isInWorkspace && workspace.explorer === "search";
        case NavOption.USER:
          return !isInWorkspace;
        default:
          return false;
      }
    },
    isDisabled: (navOption) => {
      switch (navOption) {
        case NavOption.MENU:
        case NavOption.WORKSPACES:
        case NavOption.SETTINGS:
          return true;
        default:
          return false;
      }
    },

    dispatch: (navOption) => {
      console.log(navOption);
      if (isInWorkspace) {
        switch (navOption) {
          case NavOption.FOLDER_EXPLORER:
            switchWorkspace({ ...workspace, explorer: "folder" });
            break;
          case NavOption.SEARCH_EXPLORER:
            switchWorkspace({ ...workspace, explorer: "search" });
            break;
          case NavOption.USER:
            navigate("/login");
            break;
          default:
            console.error("INVALID NAVIGATOR DISPATCH");
        }
      } else {
        switch (navOption) {
          case NavOption.FOLDER_EXPLORER:
            switchWorkspace({ ...workspace, explorer: "folder" });
            navigate("/local");
            break;
          case NavOption.SEARCH_EXPLORER:
            switchWorkspace({ ...workspace, explorer: "search" });
            navigate("/local");
            break;
          case NavOption.USER:
            break;
          default:
            console.error("INVALID NAVIGATOR DISPATCH");
        }
      }
    }
  };

  let authController = {
    isSelected: (navOption) => {
      switch (navOption) {
        case NavOption.FOLDER_EXPLORER:
          return isInWorkspace && workspace.explorer === "folder";
        case NavOption.SEARCH_EXPLORER:
          return isInWorkspace && workspace.explorer === "search";
        case NavOption.SETTINGS:
        case NavOption.USER:
          return !isInWorkspace;
        default:
          return false;
      }
    },
    isDisabled: (navOption) => {
      return navOption === NavOption.MENU;
    },

    dispatch: (navOption) => {
      if (isInWorkspace) {
        switch (navOption) {
          case NavOption.FOLDER_EXPLORER:
            switchWorkspace({ ...workspace, explorer: "folder" });
            break;
          case NavOption.SEARCH_EXPLORER:
            switchWorkspace({ ...workspace, explorer: "search" });
            break;
          case NavOption.SETTINGS:
            navigate("/settings");
            break;
          case NavOption.USER:
            navigate("/login");
            break;
          default:
            console.error("INVALID NAVIGATOR DISPATCH");
        }
      } else {
        switch (navOption) {
          case NavOption.FOLDER_EXPLORER:
            switchWorkspace({ ...workspace, explorer: "folder" });
            navigate(`/${workspace.type}/`);
            break;
          case NavOption.SEARCH_EXPLORER:
            switchWorkspace({ ...workspace, explorer: "search" });
            navigate(`/${workspace.type}/`);
            break;
          case NavOption.SETTINGS:
            navigate("/settings");
            break;
          case NavOption.USER:
            navigate("/logout");
            break;
          default:
            console.error("INVALID NAVIGATOR DISPATCH");
        }
      }
    }
  };

  return (<main id="workspace_layout">
    <NavBar id="workspace_header" navController={auth.isLoggedIn ? authController : guestController} />
    {children}
  </main>);
}

export function Layout() {

  return (<WorkspaceProvider >
    <WorkspaceLayout>
      <Outlet />
    </WorkspaceLayout>
  </WorkspaceProvider>);
}