import { useEffect, useMemo } from "react";
import { useWorkspace } from "../providers/WorkplaceProvider.jsx";
import { WorkspaceEditor } from "../components/editor/WorkspaceEditor.jsx";
import { LocalStorageAdapter } from "../../storage/adapters/LocalStorageAdapter.js";

export function LocalWorkspace() {
  const { workspace, switchWorkspace } = useWorkspace();

  // Only create the adapter once for this local workspace
  const adapter = useMemo(() => new LocalStorageAdapter(), []);

  useEffect(() => {
    if (workspace.type !== "local") {
      switchWorkspace({
        type: "local",
        explorer: workspace.explorer || "folder",
      });
    }
  }, [workspace.type, workspace.explorer, switchWorkspace]);

  return <WorkspaceEditor adapter={adapter} workspace={workspace} />;
}