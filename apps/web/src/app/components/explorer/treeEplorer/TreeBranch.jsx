import { TreeEntryFile, TreeEntryDirectory } from "./TreeEntry";

export function TreeBranch({
  directories, files,
  parentId,
  onSelect, selectedId,
  level = 0
}) {
  const childDirs = directories.filter((d) => d.parentId === parentId);
  const childFiles = files.filter((f) => f.parentId === parentId);

  return (<div style={{ paddingLeft: `${level * 5}px` }}>
    {childDirs.map((dir) => (
      <div key={dir._id}>
        <TreeEntryDirectory dir={dir} onSelect={onSelect} selectedId={selectedId} />
        <TreeBranch
          directories={directories}
          files={files}
          parentId={dir._id}
          onSelect={onSelect}
          selectedId={selectedId}
          level={level + 1}
        />
      </div>
    ))}
    {childFiles.map((file) => (
      <TreeEntryFile file={file} onSelect={onSelect} selectedId={selectedId} />
    ))}
  </div>);
}