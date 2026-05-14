import { Icon } from "./Icon"
import "./Icon.css"

export function IconButton({
  src,
  size = "medium",
  isSelected = false,
  onClick = null,
  isDisabled = false,
  alt = "",
  className = ""
}) {
  const classes = [
    "icon",
    `icon--${size}`,
    isSelected && "icon--selected",
    "icon_button",
    className,
    isDisabled && "icon_button--disabled",
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} onClick={() => { if (!isDisabled) onClick() }}>
      <img src={src} alt={alt} />
    </div>
  );
}