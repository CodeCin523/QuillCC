import { useEffect, useState } from "react";
import { IconButton } from "../../../shared/elements/IconButton.jsx";
import { Stack } from "../../../shared/elements/Stack.jsx";
import { useStorage } from "../../providers/StorageProvider.jsx";

function ExplorerTree({ directories, files, parentId, onSelect, selectedId }) {
  const childDirs = directories.filter((d) => d.parentId === parentId);
  const childFiles = files.filter((f) => f.parentId === parentId);

  return (
    <div style={{ marginLeft: parentId ? 20 : 0 }}>
      {childDirs.map((dir) => (
        <div key={dir._id}>
          <div
            onClick={() => onSelect(dir, "directory")}
            style={{
              cursor: "pointer",
              background: selectedId === dir._id ? "#ddd" : "transparent"
            }}
          >
            {dir.name}
          </div>

          <ExplorerTree
            directories={directories}
            files={files}
            parentId={dir._id}
            onSelect={onSelect}
            selectedId={selectedId}
          />
        </div>
      ))}

      {childFiles.map((file) => (
        <div
          key={file._id}
          onClick={() => onSelect(file, "file")}
          style={{
            marginLeft: 20,
            cursor: "pointer",
            background: selectedId === file._id ? "#ddd" : "transparent"
          }}
        >
          {file.name}
        </div>
      ))}
    </div>
  );
}

export function ExplorerBar() {
  const { storage } = useStorage();

  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);

  const [selected, setSelected] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelect = (item, type) => {
    setSelected({ item, type });
  };

  const refresh = () => {
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const dirs = await storage.adapter.getAllDirectories();
        const fs = await storage.adapter.getAllFiles();

        setDirectories(dirs);
        setFiles(fs);
        console.log(fs);
      } catch (err) {
        console.error("Failed to load storage:", err);
      }
    }

    fetchData();
  }, [storage, refreshKey]);

  async function createDirectory() {
    const parentId =
      selected?.type === "directory" ? selected.item._id : null;

    await storage.adapter.createDirectory({
      name: "New Folder",
      parentId
    });

    refresh();
  }

  async function createFile() {
    const parentId =
      selected?.type === "directory" ? selected.item._id : null;

    await storage.adapter.createFile({
      name: "New File",
      parentId
    });

    refresh();
  }

  async function deleteSelected() {
    if (!selected) return;

    if (selected.type === "directory") {
      await storage.adapter.deleteDirectory(selected.item._id);
    } else {
      await storage.adapter.deleteFile(selected.item._id);
    }

    setSelected(null);
    refresh();
  }

  return (
    <Stack direction="vertical" style={{ width: "200px", overflowY: "auto" }}>
      <Stack direction="horizontal">
        <IconButton src="/icons/folder-plus.png" size="small" alt=""
          isSelected={false}
          onClick={createDirectory} />
        <IconButton src="/icons/file-plus.png" size="small" alt=""
          isSelected={false}
          onClick={createFile} />
        <IconButton src="/icons/trash.png" size="small" alt=""
          isSelected={false}
          onClick={deleteSelected} isDisabled={!selected} />
      </Stack>

      <ExplorerTree
        directories={directories}
        files={files}
        parentId={null}
        onSelect={handleSelect}
        selectedId={selected?.item?._id}
      />
    </Stack>
  );
}