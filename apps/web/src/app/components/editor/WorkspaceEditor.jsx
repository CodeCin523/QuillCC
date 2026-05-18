import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { TreeExplorer } from "../explorer/TreeExplorer";
import { useWorkspace } from "../../providers/WorkplaceProvider";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function WorkspaceEditor() {
  const { t } = useTranslation();
  const { fileId } = useParams();
  const { workspace } = useWorkspace();

  // --- State ---
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [saveMessage, setSaveMessage] = useState(""); // NEW: message state

  // --- Refs ---
  const fileRef = useRef(null);
  const contentRef = useRef("");
  const adapterRef = useRef(workspace.adapter);

  useEffect(() => {
    adapterRef.current = workspace.adapter;
  }, [workspace.adapter]);

  useEffect(() => { fileRef.current = file; }, [file]);
  useEffect(() => { contentRef.current = content; }, [content]);

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
    return () => { cancelled = true; };
  }, [fileId, workspace.adapter]);

  function handleChange(value) {
    const newValue = value ?? "";
    setContent(newValue);
    contentRef.current = newValue;
  }

  // --- Save file with message ---
  async function saveFile() {
    const adapter = adapterRef.current;
    const currentFile = fileRef.current;
    if (!currentFile || !adapter) return;

    const updatedFile = { ...currentFile, content: contentRef.current };

    try {
      await adapter.saveFile(updatedFile);

      setFile(updatedFile);
      fileRef.current = updatedFile;

      setSaveMessage(t("fileSaved")); // <-- translated message
      setTimeout(() => setSaveMessage(""), 2000);
    } catch (err) {
      console.error("Error saving file:", err);
      setSaveMessage(t("fileSaveError")); // <-- translated message
      setTimeout(() => setSaveMessage(""), 2000);
    }
  }

  function handleEditorDidMount(editor, monaco) {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        saveFile();
      }
    );
  }

  if (!workspace.adapter) {
    return <div>{t("loadingWorkspace")}</div>;
  }

  return (
    <div id="workspace_body" style={{ display: "flex", height: "100%", position: "relative" }}>
      {workspace.explorer === "folder" && <TreeExplorer />}

      <Editor
        id="editor"
        height="100%"
        width="100%"
        language="markdown"
        theme="vs-dark"
        value={content}
        onChange={handleChange}
        options={{ automaticLayout: true, minimap: { enabled: false }, readOnly: !file }}
        onMount={handleEditorDidMount}
      />

      {/* --- Save message UI --- */}
      {saveMessage && (
        <div style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          padding: "8px 16px",
          backgroundColor: "#4caf50",
          color: "white",
          borderRadius: 4,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}>
          {saveMessage}
        </div>
      )}
    </div>
  );
}