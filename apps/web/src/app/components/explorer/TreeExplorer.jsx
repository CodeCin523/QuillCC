import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { IconButton } from "../../../shared/elements/IconButton.jsx";
import { Stack } from "../../../shared/elements/Stack.jsx";

import { ExplorerHeader } from "./ExplorerHeader";
import { TreeBranch } from "./treeEplorer/TreeBranch";
import { ExplorerBody } from "./ExplorerBody.jsx";

import "./TreeExplorer.css"
import { useWorkspace } from "../../providers/WorkplaceProvider.jsx";

export function TreeExplorer() {
  // --- All States ---
  const { workspace } = useWorkspace();

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
    const workspaceId = workspace.workspaceId || "default";

    const base =
      workspace.adapter.constructor.name === "LocalStorageAdapter"
        ? "/local"
        : `/remote/${workspaceId}`;

    navigate(`${base}/files/${file._id}`);
  }

  // --- Load Files ---
  useEffect(() => {
    if (!workspace.adapter) return; // Wait until adapter exists

    async function fetchData() {
      try {
        const dirs = await workspace.adapter.getAllDirectories();
        const fs = await workspace.adapter.getAllFiles();

        setDirectories(dirs);
        setFiles(fs);
      } catch (err) {
        console.error("Failed to load workspace:", err);
      }
    }

    fetchData();
  }, [workspace.adapter, refreshKey]); // watch only the adapter and refreshKey

  // --- Header's Functions ---
  async function createDirectory() {
    const parentId =
      selected?.type === "directory" ? selected.item._id : null;

    await workspace.adapter.createDirectory({
      name: "New Folder",
      parentId
    });

    refresh();
  }

  async function createFile() {
    const parentId =
      selected?.type === "directory" ? selected.item._id : null;

    await workspace.adapter.createFile({
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
      await workspace.adapter.saveDirectory({
        ...selected.item,
        name: newName
      });
    } else {
      await workspace.adapter.saveFile({
        ...selected.item,
        name: newName
      });
    }

    refresh();
  }

  async function deleteSelected() {
    if (!selected) return;

    if (selected.type === "directory") {
      await workspace.adapter.deleteDirectory(selected.item._id);
    } else {
      await workspace.adapter.deleteFile(selected.item._id);
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