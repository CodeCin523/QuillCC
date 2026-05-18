import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "../providers/WorkplaceProvider.jsx";
import { WorkspaceEditor } from "../components/editor/WorkspaceEditor.jsx";
import { RemoteStorageAdapter } from "../../storage/adapters/RemoteStorageAdapter.js";
import { useAuth } from "../providers/AuthProvider.jsx";

export function RemoteWorkspace() {
  const { workspace, switchWorkspace } = useWorkspace();
  const { workspaceId } = useParams();
  const { auth } = useAuth();

  // Memoize adapter creation based on auth token
  const adapter = useMemo(() => {
    if (!auth.token) return null; // maybe not logged in yet
    return new RemoteStorageAdapter(auth.token);
  }, [auth.token]);

  useEffect(() => {
    if (workspace.type !== "remote") {
      switchWorkspace({
        type: "remote",
        workspaceId: workspaceId || "default",
        explorer: workspace.explorer || "folder",
      });
    }
  }, [workspace.type, workspaceId, workspace.explorer, switchWorkspace]);

  // Only render editor when adapter is ready
  if (!adapter) return <div>Loading remote workspace...</div>;

  return <WorkspaceEditor adapter={adapter} workspace={workspace} />;
}