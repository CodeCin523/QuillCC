import Editor from "@monaco-editor/react";
import { TreeExplorer } from "../explorer/TreeExplorer";
import { useWorkspace } from "../../providers/WorkplaceProvider";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export function WorkspaceEditor() {
  const { fileId } = useParams();
  const { workspace } = useWorkspace();

  // --- State ---
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");

  // --- Refs (source of truth for async + Monaco safety) ---
  const fileRef = useRef(null);
  const contentRef = useRef("");
  const adapterRef = useRef(workspace.adapter);

  // Keep adapter always up to date (IMPORTANT FIX)
  useEffect(() => {
    adapterRef.current = workspace.adapter;
  }, [workspace.adapter]);

  // Sync file/content refs
  useEffect(() => {
    fileRef.current = file;
  }, [file]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // --- Load file when fileId or adapter changes ---
  useEffect(() => {
    if (!fileId || !workspace.adapter) return;

    let cancelled = false;

    async function loadFile() {
      try {
        const f = await workspace.adapter.getFile(fileId);

        if (cancelled) return;

        setFile(f);
        setContent(f?.content || "");

        fileRef.current = f;
        contentRef.current = f?.content || "";
      } catch (err) {
        console.error("Error loading file:", err);
      }
    }

    loadFile();

    return () => {
      cancelled = true;
    };
  }, [fileId, workspace.adapter]);

  // --- Editor change handler ---
  function handleChange(value) {
    const newValue = value ?? "";
    setContent(newValue);
    contentRef.current = newValue;
  }

  // --- Save file (NO CLONED CLOSURE BUG ANYMORE) ---
  async function saveFile() {
    const adapter = adapterRef.current;
    const currentFile = fileRef.current;

    if (!currentFile || !adapter) return;

    const updatedFile = {
      ...currentFile,
      content: contentRef.current,
    };

    try {
      await adapter.saveFile(updatedFile);

      setFile(updatedFile);
      fileRef.current = updatedFile;

      console.log("File saved!");
    } catch (err) {
      console.error("Error saving file:", err);
    }
  }

  // --- Monaco mount ---
  function handleEditorDidMount(editor, monaco) {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        saveFile();
      }
    );
  }

  // --- UI ---
  if (!workspace.adapter) {
    return <div>Loading workspace...</div>;
  }

  return (
    <div id="workspace_body" style={{ display: "flex", height: "100%" }}>
      {workspace.explorer === "folder" && <TreeExplorer />}

      <Editor
        id="editor"
        height="100%"
        width="100%"
        language="markdown"
        theme="vs-dark"
        value={content}
        onChange={handleChange}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          readOnly: !file,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}