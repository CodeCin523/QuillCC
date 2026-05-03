import { useState, useEffect } from "react";
import { IconButton } from "../../../shared/elements/IconButton.jsx";
import { Stack } from "../../../shared/elements/Stack.jsx";
import { useStorage } from "../../providers/StorageProvider";

import { ExplorerHeader } from "./ExplorerHeader";
import { TreeBranch } from "./treeEplorer/TreeBranch";

export function TreeExplorer() {
  // --- All States ---
  const { storage } = useStorage();

  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);

  const [selected, setSelected] = useState(null);
  const handleSelect = (item, type) => {
    console.log("test")
    setSelected({ item, type });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => {
    setRefreshKey((k) => k + 1);
  };

  // --- Load Files ---
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

  // --- Header's Functions ---
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

  // --- Actual Component ---
  return (<Stack direction="vertical" style={{ width: "200px", overflowY: "auto" }}>
    <ExplorerHeader>
      <IconButton src="/icons/folder-plus.png" size="small" alt=""
        isSelected={false}
        onClick={createDirectory} />
      <IconButton src="/icons/file-plus.png" size="small" alt=""
        isSelected={false}
        onClick={createFile} />
      <IconButton src="/icons/trash.png" size="small" alt=""
        isSelected={false}
        onClick={deleteSelected} isDisabled={!selected} />
    </ExplorerHeader>
    <TreeBranch
      directories={directories}
      files={files}
      parentId={null}
      onSelect={handleSelect}
      selectedId={selected?.item?._id}
    />
  </Stack>);
}