import React, { useState, useContext } from "react";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { AuthWrap } from "../../context/AuthWrap";
import CodeEditor from "../Code/CodeEditor";
import styles from "./CreateSnippetForm.module.css";
import SnippetHeader from "../SnippetHeader/SnippetHeader";
import SnippetEditor from "../SnippetEditor/SnippetEditor";

function CreateSnippetForm() {
  const [code, setCode] = useState(``);

  const { auth } = useContext(AuthWrap);

  const [showSidebar, setShowSidebar] = useState(true);

  const updateCode = (files) => {
    setCode(files);
  };
  const [languageValue, setLanguageValue] = useState({
    value: "vanilla",
  });

  return (
    <>
      <div className={styles.wrapper}>
        <SnippetEditor />
      </div>
    </>
  );
}

export default CreateSnippetForm;
