import { TreeEntryFile, TreeEntryDirectory } from "./TreeEntry";

export function TreeBranch({
  directories,
  files,
  parentId,
  onSelect,
  onOpenFile,
  selectedId,
  level = 0
}) {
  const childDirs = directories.filter((d) => d.parentId === parentId);
  const childFiles = files.filter((f) => f.parentId === parentId);

  return (<div
    className="tree-branch"
    style={{
      marginLeft: `${level * 12}px`
    }}
  >
    {childDirs.map((dir) => (
      <div key={dir._id}>
        <TreeEntryDirectory dir={dir} onSelect={onSelect} selectedId={selectedId} />
        <TreeBranch
          directories={directories}
          files={files}
          parentId={dir._id}
          onSelect={onSelect}
          onOpenFile={onOpenFile}
          selectedId={selectedId}
          level={level + 1}
        />
      </div>
    ))}
    {childFiles.map((file) => (
      <TreeEntryFile
        key={file._id}
        file={file}
        onSelect={onSelect}
        onOpenFile={onOpenFile}
        selectedId={selectedId}
      />
    ))}
  </div>);
}