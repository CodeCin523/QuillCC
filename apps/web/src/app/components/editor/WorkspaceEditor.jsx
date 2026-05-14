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
  const [loading, setLoading] = useState(true);

  const fileRef = useRef(null);
  const contentRef = useRef("");

  // Keep refs in sync with state
  useEffect(() => { fileRef.current = file; }, [file]);
  useEffect(() => { contentRef.current = content; }, [content]);

  // Load file when fileId or adapter changes
  useEffect(() => {
    if (!fileId || !workspace.adapter) return;

    setLoading(true);

    async function loadFile() {
      try {
        const f = await workspace.adapter.getFile(fileId);
        setFile(f);
        setContent(f?.content || "");
        fileRef.current = f;      // update ref immediately
        contentRef.current = f?.content || ""; // update ref immediately
      } catch (err) {
        console.error("Error loading file:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFile();
  }, [fileId, workspace.adapter]);

  // Handle editor content changes
  function handleChange(value) {
    const newValue = value ?? "";
    setContent(newValue);
    contentRef.current = newValue; // update ref immediately
    console.log(newValue);
    console.log(contentRef.current);
  }

  // Save file
  async function saveFile() {
    if (!fileRef.current || !workspace.adapter) return;

    const updatedFile = { ...fileRef.current, content: contentRef.current };
    try {
      await workspace.adapter.saveFile(updatedFile);
      setFile(updatedFile); // update state
      fileRef.current = updatedFile; // keep ref in sync
      console.log("File saved!");
    } catch (err) {
      console.error("Error saving file:", err);
    }
  }

  // Editor shortcut (Ctrl/Cmd + S)
  function handleEditorDidMount(editor, monaco) {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        saveFile();
      }
    );
  }

  // Loading guards
  if (!workspace.adapter) return <div>Loading workspace...</div>;
  if (!fileId) return <div>Select a file to start editing.</div>;
  if (loading) return <div>Loading file...</div>;

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