import React, { useContext, useState } from "react";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackFileExplorer,
  SandpackCodeViewer,
} from "@codesandbox/sandpack-react";
import styles from "./Snippet.module.css";
import SnippetHeader from "../SnippetHeader/SnippetHeader";
import { SnippetDisplayContext } from "../../context/SnippetDisplayContext";
import CodeEditor from "../Code/CodeEditor";
import UpdateSnippet from "../../utilities/updateSnippet";

function Snippet() {
  const { snippetDisplayStore } = useContext(SnippetDisplayContext);
  const [editActive, setEditActive] = useState(false);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState(
    snippetDisplayStore.snippetObject !== undefined
      ? snippetDisplayStore.snippetObject.title
      : ""
  );

  const handleUpdateSnippet = async () => {
    //send snippet id and updated code to backend and database
    const updateSnippet = await UpdateSnippet(
      snippetDisplayStore.snippetObject.id,
      code,
      title
    );

    setCode(updateSnippet[0].code_snippet);
    setEditActive(false);
    setTitle(title);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <SnippetHeader
          setEditActive={setEditActive}
          editActive={editActive}
          title={title}
          handleUpdateSnippet={handleUpdateSnippet}
          setTitle={setTitle}
        />
        {snippetDisplayStore.snippetObject !== undefined ? (
          <SandpackProvider
            theme={{
              colors: {
                surface1: "#232530",
                surface2: "#252525",
                surface3: "#616060",
                clickable: "#999999",
                base: "#808080",
                disabled: "#4D4D4D",
                hover: "#C5C5C5",
                accent: "#8fd9ee",
                error: "#ff453a",
                errorSurface: "#ffeceb",
              },
              syntax: {
                plain: "#8fd9ee",
                comment: {
                  color: "#757575",
                  fontStyle: "italic",
                },
                keyword: "#e0a2fb",
                tag: "#47d494",
                punctuation: "#ffffff",
                definition: "#d2f0f8",
                property: "#8fd9ee",
                static: "#FF453A",
                string: "#ffc38c",
              },
              font: {
                body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
                size: "13px",
                lineHeight: "20px",
              },
            }}
            template={snippetDisplayStore.snippetObject.language}
            customSetup={{
              files: snippetDisplayStore.snippetObject.code_snippet,
            }}
          >
            <div className={styles.editorLayout}>
              <div className={styles.sidebar}>
                <SandpackFileExplorer />
              </div>
              <div className={styles.filesWrap}>
                {editActive ? (
                  <CodeEditor updateCode={setCode} />
                ) : (
                  <SandpackCodeViewer />
                )}
                <SandpackPreview />
              </div>
            </div>
          </SandpackProvider>
        ) : null}
      </div>
    </>
  );
}

export default Snippet;
