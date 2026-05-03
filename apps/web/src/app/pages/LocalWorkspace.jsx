import { useParams } from "react-router-dom";
import { WorkspaceLayout } from "../layouts/WorkspaceLayout";

import { LocalStorageAdapter } from "../../storage/adapters/LocalStorageAdapter.js"

export function LocalWorkspace() {
  const { fileId } = useParams();

  const adapter = new LocalStorageAdapter();

  return <WorkspaceLayout storageAdapter={adapter}>

  </WorkspaceLayout>;
}