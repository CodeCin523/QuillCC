import { Stack } from "../../../shared/elements/Stack.jsx";

export function ExplorerHeader({ className, children }) {
  return (<div className={`explorer_header ${className}`}>
    {children}
  </div>);
}