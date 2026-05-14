import { IconButton } from "../../../shared/elements/IconButton.jsx";
import { Stack } from "../../../shared/elements/Stack.jsx";
import { NavOption } from "../../domain/NavOption.js";
import { useAuth } from "../../providers/AuthProvider.jsx";

import "./NavBar.css";

export function NavBar({ className, navController }) {
  const { auth } = useAuth();
  const userIconSrc =
  auth.isLoggedIn && auth.user?.logo
    ? auth.user.logo
    : "/icons/user.png";

  // Helper to render an icon button
  const renderButton = ({ src, navOption, alt }) => (
    <IconButton
      src={src}
      size="medium"
      alt={alt || ""}
      isSelected={navController.isSelected(navOption)}
      disabled={navController.isDisabled(navOption)}
      onClick={() => navController.dispatch(navOption)}
    />
  );

  return (
    <Stack id="navbar" direction="vertical" class={className}>

      {/* File / Explorer Section */}
      <div id="navbar_file">
        {renderButton({ src: "/icons/menu.png", navOption: NavOption.MENU })}
        {renderButton({ src: "/icons/folder.png", navOption: NavOption.FOLDER_EXPLORER })}
        {renderButton({ src: "/icons/search.png", navOption: NavOption.SEARCH_EXPLORER })}
        {renderButton({ src: "/icons/workspaces.png", navOption: NavOption.WORKSPACES })}
      </div>

      {/* User / Settings Section */}
      <div id="navbar_user">
        {renderButton({ src: "/icons/settings.png", navOption: NavOption.SETTINGS })}
        {renderButton({
  src: userIconSrc,
  navOption: NavOption.USER,
  alt: auth.user?.username || "User",
})}
      </div>
    </Stack>
  );
}