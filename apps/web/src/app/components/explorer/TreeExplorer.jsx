import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { IconButton } from "../../../shared/elements/IconButton.jsx";
import { Stack } from "../../../shared/elements/Stack.jsx";
import { useStorage } from "../../providers/StorageProvider";

import { ExplorerHeader } from "./ExplorerHeader";
import { TreeBranch } from "./treeEplorer/TreeBranch";
import { ExplorerBody } from "./ExplorerBody.jsx";

import "./TreeExplorer.css"

export function TreeExplorer() {
  // --- All States ---
  const { storage } = useStorage();
  const navigate = useNavigate();

  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);

  const [selected, setSelected] = useState(null);
  const handleSelect = (item, type) => {
    if (selected?.item?._id === item._id) {
      setSelected(null);
      return;
    }

    setSelected({ item, type });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => {
    setRefreshKey((k) => k + 1);
  };

  function handleOpenFile(file) {
    const base =
      storage.adapter.constructor.name === "LocalStorageAdapter"
        ? "/local/files"
        : "/remote/files";

    navigate(`${base}/${file._id}`);
  }

  // --- Load Files ---
  useEffect(() => {
    async function fetchData() {
      try {
        const dirs = await storage.adapter.getAllDirectories();
        const fs = await storage.adapter.getAllFiles();

        setDirectories(dirs);
        console.log(dirs);
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
      name: "New File.md",
      parentId
    });

    refresh();
  }

  async function renameSelected() {
    if (!selected) return;

    const newName = prompt("New name:", selected.item.name);

    if (!newName?.trim()) return;

    if (selected.type === "directory") {
      await storage.adapter.saveDirectory({
        ...selected.item,
        name: newName
      });
    } else {
      await storage.adapter.saveFile({
        ...selected.item,
        name: newName
      });
    }

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
  return (<Stack direction="vertical" className="tree_explorer">
    <ExplorerHeader>
      <IconButton src="/icons/folder-plus.png" size="small" alt=""
        isSelected={false}
        onClick={createDirectory} />
      <IconButton src="/icons/file-plus.png" size="small" alt=""
        isSelected={false}
        onClick={createFile} />
      <IconButton
        src="/icons/square-pen.png" size="small" alt=""
        isSelected={false}
        onClick={renameSelected} isDisabled={!selected} />
      <IconButton src="/icons/trash.png" size="small" alt=""
        isSelected={false}
        onClick={deleteSelected} isDisabled={!selected} />
    </ExplorerHeader>
    <ExplorerBody onClick={() => setSelected(null)}>
      <TreeBranch
        directories={directories}
        files={files}
        parentId={null}
        onSelect={handleSelect}
        onOpenFile={handleOpenFile}
        selectedId={selected?.item?._id}
      />
    </ExplorerBody>
  </Stack>);
}