import { createContext, useContext, useState } from "react";

const WorkspaceContext = createContext({
  type: "",
  explorer: "folder",
  adapter: null,
});

export function WorkspaceProvider({ type = "", explorer = "folder", adapter = null, children }) {
  const [workspace, setWorkspace] = useState({
    type: type,
    explorer: explorer,
    adapter: adapter
  });

  const switchWorkspace = ({ type, explorer, adapter }) => {
    setWorkspace({
      type: type,
      explorer: explorer,
      adapter: adapter
    });
  };

  return (<WorkspaceContext.Provider value={{ workspace, switchWorkspace }}>
    {children}
  </WorkspaceContext.Provider>);
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}