import { Icon } from "./Icon"
import "./Icon.css"

export function IconButton({
  src,
  size = "medium",
  isSelected = false,
  onClick,
  alt = "",
  className = ""
}) {
  const classes = [
    "icon",
    `icon--${size}`,
    isSelected && "icon--selected",
    "icon_button",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} onClick={onClick}>
      <img src={src} alt={alt} />
    </div>
  );
}