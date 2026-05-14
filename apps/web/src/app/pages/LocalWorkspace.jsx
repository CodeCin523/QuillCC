import { useParams } from "react-router-dom";
/* import { WorkspaceLayout } from "../layouts/WorkspaceLayout"; */
import { LocalStorageAdapter } from "../../storage/adapters/LocalStorageAdapter.js";
import { useEffect } from "react";
import { useWorkspace } from "../providers/WorkplaceProvider.jsx";
import { WorkspaceEditor } from "../components/editor/WorkspaceEditor.jsx";

export function LocalWorkspace() {
  const { workspace, switchWorkspace } = useWorkspace();

  useEffect(() => {
    // Initialize local workspace if not already
    if (workspace.type !== "local") {
      switchWorkspace({
        type: "local",
        explorer: workspace.explorer || "folder",
        adapter: new LocalStorageAdapter(),
      });
    }
  }, [workspace.type, workspace.explorer, switchWorkspace]);

  return (<WorkspaceEditor />);
}