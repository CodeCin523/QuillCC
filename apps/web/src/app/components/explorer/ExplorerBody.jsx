import { Stack } from "../../../shared/elements/Stack";

export function ExplorerBody({className, children, onClick }) {
    return (<div className={`explorer_body {className}`} onClick={onClick}>
        {children}
    </div>);
}