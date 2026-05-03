import { useEffect, useState } from "react";
import { Stack } from "../../../shared/elements/Stack.jsx";
import { useStorage } from "../../providers/StorageProvider.jsx";

function ExplorerTree({ directories, files, parentId }) {
  // Filter directories that belong to this parent
  const childDirs = directories.filter((dir) => dir.parentId === parentId);
  // Filter files that belong to this parent
  const childFiles = files.filter((file) => file.directoryId === parentId);

  return (<Stack direction="vertical" style={{ marginLeft: parentId ? "20px" : "0px" }}>
    {childDirs.map((dir) => (
      <div key={dir._id}>
        <strong>{dir.name}</strong>
        {/* Recursive call */}
        <ExplorerTree directories={directories} files={files} parentId={dir._id} />
      </div>
    ))}

    {childFiles.map((file) => (
      <div key={file._id} style={{ marginLeft: "20px" }}>
        {file.name}
      </div>
    ))}
  </Stack>);
}

export function ExplorerBar() {
  const { storage } = useStorage();
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const dirs = await storage.adapter.getAllDirectories();
        const fs = await storage.adapter.getAllFiles();
        setDirectories(dirs);
        setFiles(fs);
      } catch (err) {
        console.error("Failed to load storage:", err);
      }
    }

    fetchData();
  }, [storage]);

  return (
    <Stack direction="vertical" style={{ width: "200px", overflowY: "auto" }}>
      <ExplorerTree directories={directories} files={files} parentId={null} />
    </Stack>
  );
}