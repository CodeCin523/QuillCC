import { Stack } from "../../../shared/elements/Stack.jsx";

export function ExplorerHeader({ className, children }) {
  return (<Stack direction="horizontal" className={`explorer_header ${className}`}>
    {children}
  </Stack>);
}