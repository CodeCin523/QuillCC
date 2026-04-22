import {Icon} from "../../../shared/elements/Icon.jsx";
import {Stack} from "../../../shared/elements/Stack.jsx";

export function NavBar(props) {
  return (<Stack id="navbar" direction="vertical" class={props.className}>
    <div id="navbar_file">
      <Icon src="/icons/menu-burger.png" size="medium" isSelected={false} alt="" />
      <Icon src="/icons/folder.png" size="medium" isSelected={true} alt="" />
      <Icon src="/icons/search.png" size="medium" isSelected={false} alt="" />
    </div>
    <div id="navbar_user">
      <Icon src="/icons/settings.png" size="medium" isSelected={false} alt="" />
      <Icon src="/icons/user.png" size="medium" isSelected={false} alt="" />
    </div>
  </Stack>);
}