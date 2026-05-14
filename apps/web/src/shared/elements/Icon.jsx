import "./Icon.css"

export function Icon({
  src,
  size = "medium",
  isSelected = false,
  alt = "",
  className = ""
}) {
  const classes = [
    "icon",
    `icon--${size}`,
    isSelected && "icon--selected",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <img src={src} alt={alt} />
    </div>
  );
}