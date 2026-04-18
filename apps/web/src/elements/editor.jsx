
export default function Editor(props) {
    return (<div className={`editor ${props.className}`} style={props.style}>
        {props.children}
    </div>);
}