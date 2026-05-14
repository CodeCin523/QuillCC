import "./Stack.css"

export function Stack({
  direction = "horizontal",
  gap,
  align = "stretch",
  justify = "flex-start",
  className,
  style,
  children,
  id
}) {
  const dir = direction === "horizontal" ? "bar--h" : "bar--v";

  const mergedStyle = {
    gap,
    alignItems: align,
    justifyContent: justify,
    ...style,
  };

  return (
    <div id={id} className={`bar ${dir} ${className ?? ""}`} style={mergedStyle}>
      {children}
    </div>
  );
}