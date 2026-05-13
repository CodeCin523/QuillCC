import Editor from "@monaco-editor/react";
import { TreeExplorer } from "../explorer/TreeExplorer";
import { useWorkspace } from "../../providers/WorkplaceProvider";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export function WorkspaceEditor() {
  const { fileId } = useParams();
  const { workspace } = useWorkspace();

  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");

  const fileRef = useRef(null);
  const contentRef = useRef("");

  // Keep refs in sync
  useEffect(() => { fileRef.current = file; }, [file]);
  useEffect(() => { contentRef.current = content; }, [content]);

  // Load file when fileId changes
  useEffect(() => {
    if (!fileId || !workspace.adapter) return; // guard adapter

    async function loadFile() {
      try {
        const f = await workspace.adapter.getFile(fileId);
        setFile(f);
        setContent(f?.content || "");
      } catch (err) {
        console.error("Error loading file:", err);
      }
    }

    loadFile();
  }, [fileId, workspace.adapter]);

  function handleChange(value) {
    setContent(value || "");
  }

  async function saveFile() {
    if (!fileRef.current || !workspace.adapter) return;

    const updatedFile = { ...fileRef.current, content: contentRef.current };
    try {
      await workspace.adapter.saveFile(updatedFile);
      console.log("File saved!");
    } catch (err) {
      console.error("Error saving file:", err);
    }
  }

  function handleEditorDidMount(editor, monaco) {
    // Ctrl/Cmd + S shortcut
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => saveFile()
    );
  }

  return (
    <div id="workspace_body">
      {workspace.explorer === "folder" ? <TreeExplorer /> : <div />}
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
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}