import React from "react";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import CodeEditor from "../Code/CodeEditor";
import styles from "./SnippetEditor.module.css";
import SnippetHeader from "../SnippetHeader/SnippetHeader";

function SnippetEditor() {
  return (
    <>
      <div className={styles.wrapper}>
        <SnippetHeader />
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
          template={languageValue.value}
          customSetup={languageValue.setup}
        >
          <div className={styles.editorLayout}>
            <div className={styles.sidebar}>
              <SandpackFileExplorer />
            </div>
            <div className={styles.filesWrap}>
              <CodeEditor updateCode={updateCode} />
              <SandpackPreview />
            </div>
          </div>
        </SandpackProvider>
      </div>
    </>
  );
}

export default SnippetEditor;
