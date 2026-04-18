import "./icon.css"

export default function Icon({
  src,
  size = "medium",
  isSelected = false,
  alt = ""
}) {
  return (
    <div
      className={[
        "icon",
        `icon--${size}`,
        isSelected && "icon--selected",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img src={src} alt={alt} />
    </div>
  );
}