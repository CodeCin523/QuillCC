export function NavBar({ className }) {
  const { auth } = useAuth();
  const { workspace, switchWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();

  const userIconSrc =
    auth.isLoggedIn && auth.user?.logo
      ? auth.user.logo
      : "/icons/user.png";

  const isRemoteWorkspace = workspace?.type === "remote";

  const workspaceBasePath = isRemoteWorkspace
    ? `/remote/${workspace.workspaceId}`
    : "/local";

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
            location.pathname.startsWith("/remote") ||
            location.pathname.includes("/files")
          }
          isDisabled={false}
          onClick={() => {
            switchWorkspace({ ...workspace, explorer: "folder" });
            navigate(workspaceBasePath);
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
            navigate(workspaceBasePath);
          }}
        />

        <IconButton
          src="/icons/album.png"
          size="medium"
          alt="Workspaces"
          isSelected={false}
          isDisabled={!auth.isLoggedIn}
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
          isDisabled={!auth.isLoggedIn}
          onClick={() => navigate("/settings")}
        />

        <IconButton
          src={userIconSrc}
          size="medium"
          alt={auth.user?.username || "User"}
          isSelected={location.pathname === "/login"}
          isDisabled={false}
          onClick={() =>
            navigate(auth.isLoggedIn ? "/logout" : "/login")
          }
        />
      </div>
    </Stack>
  );
}