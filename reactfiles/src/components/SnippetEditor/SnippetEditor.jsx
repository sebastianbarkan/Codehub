import React, { useState } from "react";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import CodeEditor from "../Code/CodeEditor";
import styles from "./SnippetEditor.module.css";
import SnippetEditorHeader from "../SnippetEditorHeader/SnippetEditorHeader";
import CreateSnippet from "../../utilities/createSnippet";
import { useContext } from "react";
import { AuthWrap } from "../../context/AuthWrap";
import { SnippetContext } from "../../context/SnippetContext";
import { SnippetDisplayContext } from "../../context/SnippetDisplayContext";
import { useNavigate } from "react-router-dom";

function SnippetEditor() {
  const [language, setLanguage] = useState("vanilla");
  const [code, setCode] = useState("");
  const [title, setTitle] = useState(
    localStorage.getItem("title") === undefined ||
      localStorage.getItem("title") === null
      ? "Untitled"
      : localStorage.getItem("title")
  );
  const [privacy, setPrivacy] = useState(true);
  let navigate = useNavigate();
  const { auth } = useContext(AuthWrap);
  const { snippetStore } = useContext(SnippetContext);
  const { snippetDisplayStore, setSnippetDisplayStore } = useContext(
    SnippetDisplayContext
  );
  const [lengthWarning, setLengthWarning] = useState(false);
  const [existsWarning, setExistsWarning] = useState(false);
  const languageOptions = [
    {
      value: "react-ts",
      label: "react/typescript",
      setup: {
        files: {},
      },
    },
    { value: "react", label: "react", setup: {} },
    { value: "angular", label: "angular", setup: {} },
    { value: "vue", label: "vue", setup: {} },
    { value: "vue3", label: "vue3", setup: {} },
    { value: "vanilla-ts", label: "typescript", setup: {} },
    {
      value: "vanilla",
      label: "vanilla js",
      setup: {},
    },
  ];

  const handleCreateSnippet = async () => {
    //check if values are populated correctly
    if (title.length === 0) {
      setLengthWarning(true);
      return null;
    }

    //check if snippet title is already used
    const checkTitles = (obj) => obj.title === title;
    if (snippetStore.snippetArray.some(checkTitles) === true) {
      setExistsWarning(true);
      return null;
    }

    //create new date for snippet
    let date = Date.now();

    //define object with snippet info
    const snippetObject = {
      user_id: auth.userData.id,
      title: title,
      created_at: date,
      language: language,
      public: privacy,
      author: auth.userData.username,
    };

    //send code and snippet info to backend to update database
    const createSnippet = await CreateSnippet(snippetObject, code);

    //reset snippet values for resuse if creation was succesful
    if (createSnippet === 200) {
      snippetObject.code_snippet = code;
      localStorage.setItem(
        "snippetDisplayArray",
        JSON.stringify(snippetObject)
      );
      setSnippetDisplayStore({
        ...snippetDisplayStore,
        snippetObject: JSON.parse(localStorage.getItem("snippetDisplayArray")),
      });
      navigate(`/snippetdisplay/${title + auth.userData.username}`);
      setCode("");
      setTitle("Untitled");
      localStorage.removeItem("title");
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <SnippetEditorHeader
          createSnippet={handleCreateSnippet}
          title={title}
          setTitle={setTitle}
          language={language}
          setLanguage={setLanguage}
          languageOptions={languageOptions}
          privacy={privacy}
          lengthWarning={lengthWarning}
          existsWarning={existsWarning}
          setPrivacy={setPrivacy}
        />
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
          template={language}
          customSetup={language}
        >
          <div className={styles.editorLayout}>
            <div className={styles.sidebar}>
              <SandpackFileExplorer />
            </div>
            <div className={styles.filesWrap}>
              <CodeEditor updateCode={setCode} />
              <SandpackPreview />
            </div>
          </div>
        </SandpackProvider>
      </div>
    </>
  );
}

export default SnippetEditor;
