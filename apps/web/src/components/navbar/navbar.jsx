import Icon from "../../elements/icon";
import "./navbar.css"

export default function NavBar(props) {
  return (<div id="navbar" class={props.className}>
    <div id="navbar_file">
      <Icon src="/icons/menu-burger.png" size="medium" isSelected={false} alt="" />
      <Icon src="/icons/folder.png" size="medium" isSelected={true} alt="" />
      <Icon src="/icons/search.png" size="medium" isSelected={false} alt="" />
    </div>
    <div id="navbar_user">
      <Icon src="/icons/settings.png" size="medium" isSelected={false} alt="" />
      <Icon src="/icons/user.png" size="medium" isSelected={false} alt="" />
    </div>
  </div>);
}