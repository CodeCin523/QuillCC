import { useParams } from "react-router-dom";
import { WorkspaceLayout } from "../layouts/WorkspaceLayout";
import { LocalStorageAdapter } from "../../storage/adapters/LocalStorageAdapter.js";

import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";

export function LocalWorkspace() {
  const { fileId } = useParams();
  const adapter = new LocalStorageAdapter();

  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");

  // refs to hold latest values
  const fileRef = useRef(null);
  const contentRef = useRef("");

  useEffect(() => {
    fileRef.current = file;
  }, [file]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Load file asynchronously
  useEffect(() => {
    if (!fileId) return;

    async function loadFile() {
      try {
        const f = await adapter.getFile(fileId);
        setFile(f);
        setContent(f?.content || "");
      } catch (err) {
        console.error("Error loading file:", err);
      }
    }

    loadFile();
  }, [fileId]);

  function handleChange(value) {
    setContent(value || "");
  }

  // Save function always uses refs
  async function saveFile() {
    const f = fileRef.current;
    if (!f) return;

    const updatedFile = { ...f, content: contentRef.current };
    await adapter.saveFile(updatedFile);
    console.log("File saved!");
  }

  // Editor mount: add Ctrl+S / Cmd+S shortcut
  function handleEditorDidMount(editor, monaco) {
    // Ctrl/Cmd + S
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        saveFile();
      }
    );
  }

  return (
    <WorkspaceLayout storageAdapter={adapter}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          minWidth: 0,
        }}
      >
        <Editor
          height="100%"
          width="100%"
          language="markdown"
          theme="vs-dark"
          value={content}
          onChange={handleChange}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </WorkspaceLayout>
  );
}