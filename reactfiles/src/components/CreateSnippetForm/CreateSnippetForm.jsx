import React, { useState, useContext } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import Select from "react-select";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { AuthWrap } from "../../context/AuthWrap";
import CodeEditor from "../Code/CodeEditor";
import styles from "./CreateSnippetForm.module.css";

function CreateSnippetForm() {
  const [code, setCode] = useState(``);
  const [showSidebar, setShowSidebar] = useState(true);
  const { auth } = useContext(AuthWrap);
  const [titleLengthWarning, setTitleLengthWarning] = useState(false);
  const [descriptionLengthWarning, setDescriptionLengthWarning] =
    useState(false);
  const handleToggle = () => {
    setShowSidebar(!showSidebar);
  };

  const [animate, setAnimate] = useState(false);

  const updateCode = (files) => {
    setCode(files);
  };
  const [languageValue, setLanguageValue] = useState({
    value: "vanilla",
  });

  const [snippetTitle, setSnippetTitle] = useState("");
  const [snippetDescription, setSnippetDescription] = useState("");
  const [publicSelected, setPublicSelected] = useState(true);
  const [privateSelected, setPrivateSelected] = useState(false);

  const handleSnippetDescription = (e) => {
    setSnippetDescription(e.target.value);
  };

  const handleSnippetTitle = (e) => {
    setSnippetTitle(e.target.value);
  };

  let jsonData = auth.userData;

  const options = [
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

  const addSnippet = () => {
    if (snippetTitle.length === 0) {
      setTitleLengthWarning(true);
      return null;
    } else if (snippetDescription.length === 0) {
      setDescriptionLengthWarning(true);
      return null;
    }

    let date = new Date();
    let dateFormat = date.toISOString().split("T")[0];

    let privacy;

    if (publicSelected) {
      privacy = true;
    } else if (privateSelected) {
      privacy = false;
    }

    try {
      fetch(`http://localhost:8080/snippets/create`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            user_id: jsonData.id,
            title: snippetTitle,
            created_at: dateFormat,
            language: languageValue.value,
            public: privacy,
            description: snippetDescription,
            author: jsonData.username,
          },
          code,
        ]),
      }).then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            setAnimate(false);
          }, 1500);
          setAnimate(true);
          setSnippetTitle("");
          setLanguageValue({ value: "vanilla" });
          setSnippetDescription("");
          setCode(`export default function App() {
            return <h1>Hello World</h1>
          }`);
          setTitleLengthWarning(false);
          setDescriptionLengthWarning(false);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrivate = () => {
    if (publicSelected === true) {
      setPublicSelected(false);
      setPrivateSelected(true);
    }
  };

  const handlePublic = () => {
    if (privateSelected === true) {
      setPrivateSelected(false);
      setPublicSelected(true);
    }
  };

  const customStyles = {
    option: (provided) => ({
      ...provided,
      padding: 20,
      cursor: "pointer",
      backgroundColor: "#505050",
      borderBottom: "1px solid white",
    }),
    control: () => ({
      cursor: "pointer",
      display: "flex",
      color: "white",
      backgroundColor: "#505050",
      width: "100%",
      borderRadius: "4px",
    }),
    menu: (provided, state) => ({
      ...provided,
      color: "white",
      backgroundColor: "#505050",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: "white",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      opacity: state.isDisabled ? "0.5" : "1",
      transition: "opacity 300ms",
      "&:hover": {
        backgroundColor: "none",
      },
      color: "white",
    }),
    container: (provided, state) => ({
      ...provided,
      width: "100%",
      color: "white",
    }),
    input: (provided, state) => ({
      ...provided,
      color: "white",
    }),
  };

  return (
    <>
      <div className={styles.wrapper}>
        <SandpackProvider
          theme={{
            colors: {
              surface1: "#1b1b1b",
              surface2: "#252525",
              surface3: "#2F2F2F",
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
              {showSidebar ? (
                <div className={styles.sidebarToggle}>
                  <div className={styles.toggleWrap} onClick={handleToggle}>
                    <FaArrowLeft />
                  </div>
                </div>
              ) : (
                <div
                  className={`${styles.sidebarToggle} ${styles.hiddenToggle}`}
                >
                  <div className={styles.toggleWrap} onClick={handleToggle}>
                    <FaArrowRight />
                  </div>
                </div>
              )}
              <div
                className={
                  showSidebar
                    ? styles.sidebarContent
                    : ` ${styles.sidebarContent} ${styles.sidebarContentHidden}`
                }
              >
                <p className={styles.sidebarLabel}>Explorer</p>
                <SandpackFileExplorer />
                <p className={styles.sidebarLabel}>Snippet Info</p>
                <div className={styles["title-wrap"]}>
                  <div className={styles.labelWrap}>
                    <label htmlFor="titleInput" className={styles.label}>
                      Title
                    </label>
                    {titleLengthWarning ? (
                      <p className={styles.lengthWarning}>
                        You must include a title
                      </p>
                    ) : null}
                  </div>

                  <input
                    type="text"
                    id="titleInput"
                    value={snippetTitle}
                    onChange={handleSnippetTitle}
                    placeholder="Enter a title..."
                    className={styles["title-input"]}
                  ></input>
                </div>
                <div className={styles["description-wrap"]}>
                  <div className={styles.labelWrap}>
                    <label htmlFor="descriptionInput" className={styles.label}>
                      Description
                    </label>
                    {descriptionLengthWarning ? (
                      <p className={styles.lengthWarning}>
                        You must include a description
                      </p>
                    ) : null}
                  </div>

                  <input
                    id="descriptionInput"
                    value={snippetDescription}
                    onChange={handleSnippetDescription}
                    placeholder="Provide a description..."
                    className={styles["description-input"]}
                  ></input>
                </div>

                <div className={styles.selectWrap}>
                  <label htmlFor="reactselect" className={styles.label}>
                    Select a framework/language
                  </label>
                  <Select
                    id="reactselect"
                    styles={customStyles}
                    className={styles["language-select"]}
                    placeholder={languageValue.value}
                    options={options}
                    onChange={(choice) => setLanguageValue(choice)}
                    value={languageValue.value}
                  />
                </div>

                <div className={styles["create-form-privacy-wrap"]}>
                  <p className={styles.label}>This snippet will be</p>
                  <div className={styles["privacy-buttons-wrap"]}>
                    <button
                      type="button"
                      onClick={handlePublic}
                      className={
                        publicSelected
                          ? `${styles["privacy-button"]}  ${styles.selected}`
                          : `${styles["privacy-button"]}`
                      }
                    >
                      Public
                    </button>
                    <button
                      type="button"
                      onClick={handlePrivate}
                      className={
                        privateSelected
                          ? `${styles["privacy-button"]}  ${styles.selected}`
                          : `${styles["privacy-button"]}`
                      }
                    >
                      Private
                    </button>
                  </div>
                </div>
                <div className={styles.createButtonWrap}>
                  {animate ? (
                    <div className={styles.savedSnippetWrap}>
                      <FaCheck className={styles.checkIcon} />
                      <p className={styles.snippetAdded}>Snippet Added</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles["create-snippet-button"]}
                      onClick={addSnippet}
                    >
                      Create Snippet
                    </button>
                  )}
                </div>
              </div>
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

export default CreateSnippetForm;
