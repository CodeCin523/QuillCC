import { createPortal } from "react-dom"

export default function Dialog(props) {
  if (props.hidden) return null;

  const container = document.getElementById("dialog");

  return createPortal(
    <div className={`dialog ${props.className}`} style={props.style}>
      {props.children}
    </div>, container
  );
}