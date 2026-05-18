import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { TreeExplorer } from "../explorer/TreeExplorer";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function WorkspaceEditor({ adapter, workspace }) { // <-- pass adapter as prop
  const { t } = useTranslation();
  const { fileId } = useParams();

  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const fileRef = useRef(null);
  const contentRef = useRef("");

  useEffect(() => { fileRef.current = file; }, [file]);
  useEffect(() => { contentRef.current = content; }, [content]);

  // --- Load file ---
useEffect(() => {
  if (!fileId) return;
  if (!adapter) return; // wait for adapter

  let cancelled = false;

  const loadFile = async () => {
    try {
      const f = await adapter.getFile(fileId);
      if (cancelled) return;
      setFile(f);
      setContent(f?.content || "");
      fileRef.current = f;
      contentRef.current = f?.content || "";
    } catch (err) {
      console.error("Error loading file:", err);
    }
  };

  loadFile();

  return () => { cancelled = true; };
}, [fileId, adapter]);

  function handleChange(value) {
    const newValue = value ?? "";
    setContent(newValue);
    contentRef.current = newValue;
  }

  async function saveFile() {
    const currentFile = fileRef.current;
    if (!currentFile || !adapter) return;

    const updatedFile = { ...currentFile, content: contentRef.current };

    try {
      await adapter.saveFile(updatedFile);

      // Update ref and state for rendering
      fileRef.current = updatedFile;
      setFile(updatedFile);

      // Show the save message
      setSaveMessage(t("fileSaved") || "File saved!");

      // Hide after 2 seconds
      setTimeout(() => {
        // Important: wrap in a function, not arrow in setState
        setSaveMessage(""); 
      }, 2000);
    } catch (err) {
      console.error("Error saving file:", err);
      setSaveMessage(t("fileSaveError") || "Save failed!");
      setTimeout(() => setSaveMessage(""), 2000);
    }
  }

  const handleEditorDidMount = (editor, monaco) => {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => saveFile()
    );
  };

  return (
    <div style={{ display: "flex", height: "100%", position: "relative" }}>
  {workspace.explorer === "folder" && <TreeExplorer adapter={adapter} workspace={workspace} />}

  <div style={{ flex: 1, position: "relative" }}>
    <Editor
      height="100%"
      width="100%"
      language="markdown"
      theme="vs-dark"
      value={content}
      onChange={handleChange}
      options={{ automaticLayout: true, minimap: { enabled: false }, readOnly: !file }}
      onMount={handleEditorDidMount}
    />

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
        zIndex: 1000 // << make sure it's above the editor
      }}>
        {saveMessage}
      </div>
    )}
  </div>
</div>
  );
}