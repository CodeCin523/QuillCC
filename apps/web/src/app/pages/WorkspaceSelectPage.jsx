import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../shared/domain/api.js";
import { useAuth } from "../app/providers/AuthProvider";

import "./WorkspaceSelectPage.css";

export function WorkspaceSelectPage() {
  const { token } = useAuth();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const data = await apiRequest("/api/workspaces", {
          token,
        });

        setWorkspaces(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaces();
  }, [token]);

  return (
    <div className="page-center">
      <div className="form-card workspace-card">
        <h1 className="form-title">
          Select Workspace
        </h1>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="workspace-loading">
            Loading...
          </div>
        ) : (
          <div className="workspace-list">
            {/* Local workspace */}
            <Link
              to="/local"
              className="workspace-item"
            >
              <div className="workspace-name">
                Local Workspace
              </div>

              <div className="workspace-type">
                Local
              </div>
            </Link>

            {/* Remote workspaces */}
            {workspaces.map((workspace) => (
              <Link
                key={workspace._id}
                to={`/remote/${workspace._id}`}
                className="workspace-item"
              >
                <div className="workspace-name">
                  {workspace.name}
                </div>

                <div className="workspace-type">
                  Remote
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}