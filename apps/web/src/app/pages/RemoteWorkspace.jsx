import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";
import { useWorkspace } from "../providers/WorkplaceProvider.jsx";
import { RemoteStorageAdapter } from "../../storage/adapters/RemoteStorageAdapter.js";
import { WorkspaceEditor } from "../components/editor/WorkspaceEditor.jsx";

export function RemoteWorkspace() {
  const { auth } = useAuth();
  const { workspace, switchWorkspace } = useWorkspace();
  const { workspaceId } = useParams();

  useEffect(() => {
    if (workspace.type !== "remote") {
      switchWorkspace({
        type: "remote",
        adapter: new RemoteStorageAdapter(auth.token),
        workspaceId: workspaceId || "default",
        explorer: workspace.explorer || "folder",
      });
    }
  }, [workspace.type, workspaceId, auth.token, workspace.explorer, switchWorkspace]);

  return <WorkspaceEditor />;
}