import "./Stack.css"

export  function Stack({
  direction = "horizontal",
  gap,
  align = "stretch",
  justify = "flex-start",
  className,
  style,
  children,
}) {
  const dir = direction === "horizontal" ? "bar--h" : "bar--v";

  const mergedStyle = {
    gap,
    alignItems: align,
    justifyContent: justify,
    ...style,
  };

  return (
    <div className={`bar ${dir} ${className ?? ""}`} style={mergedStyle}>
      {children}
    </div>
  );
}