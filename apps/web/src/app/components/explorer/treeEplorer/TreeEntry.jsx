export function TreeEntryFile({
  file,
  onSelect,
  onOpenFile,
  selectedId
}) {
  const isSelected = selectedId === file._id;

  return (
    <div
      className={`tree_entry ${isSelected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(file, "file");
      }}
      onDoubleClick={() => onOpenFile(file)}
    >
      <span className="tree-entry-icon">📄</span>
      <span className="tree-entry-name">
        {file.name}
      </span>
    </div>
  );
}

export function TreeEntryDirectory({
  dir,
  onSelect,
  selectedId
}) {
  const isSelected = selectedId === dir._id;

  return (
    <div
      className={`tree_entry ${isSelected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(dir, "directory");
      }}
    >
      <span className="tree-entry-icon">📁</span>
      <span className="tree-entry-name">
        {dir.name}
      </span>
    </div>
  );
}