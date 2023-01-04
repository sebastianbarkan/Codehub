import React, { useState, useContext } from "react";
import styles from "../CreateSnippetDetails/CreateSnippetDetails.module.css";
import Select from "react-select";
import CreateSnippet from "../../utilities/createSnippet";
import { AuthWrap } from "../../context/AuthWrap";

function CreateSnippetDetails() {
  const [titleLengthWarning, setTitleLengthWarning] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState("");
  const [publicSelected, setPublicSelected] = useState(true);
  const [privateSelected, setPrivateSelected] = useState(false);
  const { auth } = useContext(AuthWrap);
  let jsonData = auth.userData;

  const handleSnippetTitle = (e) => {
    setSnippetTitle(e.target.value);
  };

  const handleCreateSnippet = async () => {
    //check if values are populated correctly
    if (snippetTitle.length === 0) {
      setTitleLengthWarning(true);
      return null;
    }
    //create new date for snippet
    let date = new Date();
    let dateFormat = date.toISOString().split("T")[0];

    //set privacy
    let privacy;
    if (publicSelected) {
      privacy = true;
    } else if (privateSelected) {
      privacy = false;
    }

    //define object with snippet info
    const snippetObject = {
      user_id: jsonData.id,
      title: snippetTitle,
      created_at: dateFormat,
      language: languageValue.value,
      public: privacy,
      author: jsonData.username,
    };

    //send code and snippet info to backend to update database
    const createSnippet = await CreateSnippet(snippetObject, code);

    //reset snippet values for resuse if creation was succesful
    if (createSnippet === 200) {
      setTimeout(() => {
        setAnimate(false);
      }, 1500);
      setAnimate(true);
      setSnippetTitle("");
      setLanguageValue({ value: "vanilla" });
      setCode(`export default function App() {
            return <h1>Hello World</h1>
          }`);
      setTitleLengthWarning(false);
    }
  };

  //handle selected snippet privacy
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

  //custom styles for react select
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
    <div className={styles.wrapper}>
      <p className={styles.sidebarLabel}>Snippet Info</p>
      <div className={styles["title-wrap"]}>
        <div className={styles.labelWrap}>
          <label htmlFor="titleInput" className={styles.label}>
            Title
          </label>
          {titleLengthWarning ? (
            <p className={styles.lengthWarning}>You must include a title</p>
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
            onClick={handleCreateSnippet}
          >
            Create Snippet
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateSnippetDetails;
