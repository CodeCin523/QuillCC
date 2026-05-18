import { IconButton } from "../../../shared/elements/IconButton.jsx";
import { Stack } from "../../../shared/elements/Stack.jsx";
import { NavOption } from "../../domain/NavOption.js";
import { useAuth } from "../../providers/AuthProvider.jsx";
import { useWorkspace } from "../../providers/WorkplaceProvider.jsx";
import { useNavigate, useLocation } from "react-router-dom";

import "./NavBar.css";

export function NavBar({ className }) {
  const { auth } = useAuth();
  const { workspace, switchWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();

  const userIconSrc =
    auth.isLoggedIn && auth.user?.logo
      ? auth.user.logo
      : "/icons/user.png";

  return (
    <Stack id="navbar" direction="vertical" class={className}>
      {/* File / Explorer Section */}
      <div id="navbar_file">
        <IconButton
          src="/icons/menu.png"
          size="medium"
          alt="Menu"
          isSelected={false}
          isDisabled={false}
          onClick={() => console.warn("Menu clicked")}
        />

        <IconButton
          src="/icons/folder.png"
          size="medium"
          alt="Folder Explorer"
          isSelected={
            location.pathname.startsWith("/local") ||
            location.pathname.includes("/files")
          }
          isDisabled={false}
          onClick={() => {
            switchWorkspace({ ...workspace, explorer: "folder" });
            navigate("/local");
          }}
        />

        <IconButton
          src="/icons/search.png"
          size="medium"
          alt="Search Explorer"
          isSelected={workspace.explorer === "search"}
          isDisabled={false}
          onClick={() => {
            switchWorkspace({ ...workspace, explorer: "search" });
            navigate("/local");
          }}
        />

        <IconButton
          src="/icons/album.png"
          size="medium"
          alt="Workspaces"
          isSelected={false}
          isDisabled={!auth.isLoggedIn} // isDisabled if not logged in
          onClick={() => navigate(auth.isLoggedIn ? "/workspaces" : "/login")}
        />
      </div>

      {/* User / Settings Section */}
      <div id="navbar_user">
        <IconButton
          src="/icons/settings.png"
          size="medium"
          alt="Settings"
          isSelected={location.pathname === "/settings"}
          isDisabled={!auth.isLoggedIn} // isDisabled if not logged in
          onClick={() => navigate("/settings")}
        />

        <IconButton
          src={userIconSrc}
          size="medium"
          alt={auth.user?.username || "User"}
          isSelected={location.pathname === "/login"}
          isDisabled={false} // user login/logout is always clickable
          onClick={() =>
            navigate(auth.isLoggedIn ? "/logout" : "/login")
          }
        />
      </div>
    </Stack>
  );
}