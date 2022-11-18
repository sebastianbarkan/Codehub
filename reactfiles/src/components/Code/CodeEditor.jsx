import React, { useEffect } from "react";
import { SandpackCodeEditor, useSandpack } from "@codesandbox/sandpack-react";
import styles from "../Code/CodeEditor.module.css";

function CodeEditor(props) {
  const { sandpack } = useSandpack();
  const { files, activeFile } = sandpack;

  useEffect(() => {
    props.updateCode(files);
  }, [files]);

  return (
    <>
      <div className={styles.wrap}>
        <SandpackCodeEditor
          closableTabs
          OpenInCodeSandboxButton={false}
          showTabs={true}
          showNavigator={true}
        />
      </div>

      <div className={styles.wrapMobile}>
        <SandpackCodeEditor
          closableTabs
          OpenInCodeSandboxButton={false}
          showTabs={false}
          showNavigator={true}
        />
      </div>
    </>
  );
}

export default CodeEditor;
