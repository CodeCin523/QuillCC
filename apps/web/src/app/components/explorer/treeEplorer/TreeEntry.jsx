export function TreeEntryFile({ file, onSelect, selectedId }) {
  return (<div key={file._id} onClick={() => onSelect(file, "file")}
    style={{
      cursor: "pointer",
      background: selectedId === file._id ? "#ddd" : "transparent"
    }}>
    {file.name}
  </div>);
}

export function TreeEntryDirectory({ dir, onSelect, selectedId }) {
  return (<div onClick={() => onSelect(dir, "directory")}
    style={{
      cursor: "pointer",
      background: selectedId === dir._id ? "#ddd" : "transparent"
    }}>
    {dir.name}
  </div>);
}