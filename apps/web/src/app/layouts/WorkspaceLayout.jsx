import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { ExplorerBar } from "../components/explorer/ExplorerBar";
// import { SearchBar } from "../components/explorer/SearchBar";
import { NavBar } from "../components/navigation/NavBar";
import { StorageProvider } from "../providers/StorageProvider";

import { NavAction } from "../actions/NavAction.js";

import "./Layout.css";

export function WorkspaceLayout({ storageAdapter, children }) {
  const [explorerMode, setExplorerMode] = useState("folder"); // "folder" or "search"
  const navigate = useNavigate();

  const workspaceNavController = {
    isSelected: (navAction) => {
      switch (navAction) {
        case NavAction.FOLDER_EXPLORER:
          return explorerMode === "folder";
        case NavAction.SEARCH_EXPLORER:
          return explorerMode === "search";
        default:
          return false; // settings / user not selected state here
      }
    },
    dispatch: (navAction) => {
      console.log("test")
      switch (navAction) {
        case NavAction.FOLDER_EXPLORER:
          setExplorerMode("folder");
          break;
        case NavAction.SEARCH_EXPLORER:
          setExplorerMode("search");
          break;
        case NavAction.SETTINGS:
          navigate("/settings");
          break;
        case NavAction.USER:
          navigate("/login");
          break;
      }
    },
  };

  return (
    <StorageProvider storageAdapter={storageAdapter}>
      <NavBar navController={workspaceNavController} />
      {explorerMode === "folder" ? <ExplorerBar /> : null}
      <main>{children ? children : <Outlet />}</main>
    </StorageProvider>
  );
}