import { IconButton } from "../../../shared/elements/IconButton.jsx";
import { Stack } from "../../../shared/elements/Stack.jsx";
import { NavAction } from "../../actions/NavAction.js";

export function NavBar({ className, navController }) {
  return (<Stack id="navbar" direction="vertical" class={className}>
    <div id="navbar_file">
      <IconButton src="/icons/menu.png" size="medium" alt=""
        isSelected={navController.isSelected(NavAction.MENU)}
        onClick={() => navController.dispatch(NavAction.MENU)} />
      <IconButton src="/icons/folder.png" size="medium" alt=""
        isSelected={navController.isSelected(NavAction.FOLDER_EXPLORER)}
        onClick={() => navController.dispatch(NavAction.FOLDER_EXPLORER)} />
      <IconButton src="/icons/search.png" size="medium" alt=""
        isSelected={navController.isSelected(NavAction.SEARCH_EXPLORER)}
        onClick={() => navController.dispatch(NavAction.SEARCH_EXPLORER)} />
    </div>
    <div id="navbar_user">
      <IconButton src="/icons/settings.png" size="medium" alt=""
        isSelected={navController.isSelected(NavAction.SETTINGS)}
        onClick={() => navController.dispatch(NavAction.SETTINGS)} />
      <IconButton src="/icons/user.png" size="medium" alt=""
        isSelected={navController.isSelected(NavAction.USER)}
        onClick={() => navController.dispatch(NavAction.USER)} />
    </div>
  </Stack>);
}