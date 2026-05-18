import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { IconButton } from "../../../shared/elements/IconButton.jsx";
import { Stack } from "../../../shared/elements/Stack.jsx";

import { ExplorerHeader } from "./ExplorerHeader";
import { TreeBranch } from "./treeEplorer/TreeBranch";
import { ExplorerBody } from "./ExplorerBody.jsx";

import "./TreeExplorer.css"

export function TreeExplorer({ adapter, workspace }) { // <-- pass adapter as prop
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
  const refresh = () => setRefreshKey(k => k + 1);

  function handleOpenFile(file) {
    let base;
  
    if (workspace.type === "local") {
      base = "/local"; // local workspace base
    } else if (workspace.type === "remote") {
      const workspaceId = workspace.workspaceId || "default";
      base = `/remote/${workspaceId}`;
    } else {
      console.warn("Unknown workspace type:", workspace.type);
      base = "/"; // fallback
    }
  
    navigate(`${base}/files/${file._id}`);
  }

  // --- Load files using the passed adapter ---
  useEffect(() => {
    if (!adapter) return;

    async function fetchData() {
      try {
        const dirs = await adapter.getAllDirectories();
        const fs = await adapter.getAllFiles();

        setDirectories(dirs);
        setFiles(fs);
      } catch (err) {
        console.error("Failed to load workspace:", err);
      }
    }

    fetchData();
  }, [adapter, refreshKey]);

  // --- Header actions ---
  async function createDirectory() {
    const parentId = selected?.type === "directory" ? selected.item._id : null;
    await adapter.createDirectory({ name: "New Folder", parentId });
    refresh();
  }

  async function createFile() {
    const parentId = selected?.type === "directory" ? selected.item._id : null;
    await adapter.createFile({ name: "New File.md", parentId });
    refresh();
  }

  async function renameSelected() {
    if (!selected) return;
    const newName = prompt("New name:", selected.item.name);
    if (!newName?.trim()) return;

    if (selected.type === "directory") {
      await adapter.saveDirectory({ ...selected.item, name: newName });
    } else {
      await adapter.saveFile({ ...selected.item, name: newName });
    }
    refresh();
  }

  async function deleteSelected() {
    if (!selected) return;
    if (selected.type === "directory") {
      await adapter.deleteDirectory(selected.item._id);
    } else {
      await adapter.deleteFile(selected.item._id);
    }
    setSelected(null);
    refresh();
  }

  return (
    <Stack direction="vertical" className="tree_explorer">
      <ExplorerHeader>
        <IconButton src="/icons/folder-plus.png" size="small" alt=""
          isSelected={false} onClick={createDirectory} />
        <IconButton src="/icons/file-plus.png" size="small" alt=""
          isSelected={false} onClick={createFile} />
        <IconButton src="/icons/square-pen.png" size="small" alt=""
          isSelected={false} isDisabled={!selected} onClick={renameSelected} />
        <IconButton src="/icons/trash.png" size="small" alt=""
          isSelected={false} isDisabled={!selected} onClick={deleteSelected} />
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
    </Stack>
  );
}