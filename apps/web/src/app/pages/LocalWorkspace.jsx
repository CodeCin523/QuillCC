import { useParams } from "react-router-dom";
import { WorkspaceLayout } from "../layouts/WorkspaceLayout";

export function LocalWorkspace() {
    const { fileId } = useParams();

    return <WorkspaceLayout>
        
    </WorkspaceLayout>;
}