import { createPortal } from "react-dom"

export  function Dialog({className, style, children, hidden}) {
  if (hidden) return null;

  const container = document.getElementById("dialog");

  return createPortal(
    <div className={`dialog ${className}`} style={style}>
      {children}
    </div>, container
  );
}