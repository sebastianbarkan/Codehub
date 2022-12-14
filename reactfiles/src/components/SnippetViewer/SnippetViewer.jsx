import React, { useState } from "react";
import { FaStar, FaArrowLeft, FaHeart, FaCheck } from "react-icons/fa";
import styles from "./SnippetViewer.module.css";
import { SnippetDisplayContext } from "../../context/SnippetDisplayContext";
import { useContext } from "react";
import { Oval } from "react-loader-spinner";
import {
  SandpackProvider,
  SandpackFileExplorer,
  SandpackPreview,
  SandpackCodeViewer,
} from "@codesandbox/sandpack-react";
import { AuthWrap } from "../../context/AuthWrap";
import { useNavigate } from "react-router-dom";
import Avatar from "boring-avatars";
import SaveSnippet from "../../utilities/saveSnippet";
import SnippetSkeleton from "../SnippetSkeleton/SnippetSkeleton";

function SnippetViewer() {
  const { snippetDisplayStore } = useContext(SnippetDisplayContext);
  const { auth, setAuth } = useContext(AuthWrap);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const toggleExplorer = () => {
    setExplorerOpen(!explorerOpen);
  };

  let navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const handleSaveSnippet = async (e) => {
    //stop propogation to only trigger save function
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    let saved;
    //check if saved object is null
    if (auth.userData.saved === null) {
      //if it is then create new object and add current snippet
      let key = snippetDisplayStore.snippetViewerObject.id;
      saved = {
        [key]: key,
      };
    } else {
      //if not null then check to make sure its not already saved
      for (let i in auth.userData.saved) {
        if (i === snippetDisplayStore.snippetViewerObject.id) {
          return null;
        }
      }
      //then add it to the saved object
      auth.userData.saved[snippetDisplayStore.snippetViewerObject.id] =
        snippetDisplayStore.snippetViewerObject.id;
      saved = auth.userData.saved;
    }
    //send the updated saved object to backend and database
    const saveSnippet = await SaveSnippet(saved, auth.userData.id);
    //decode response by and parse it to json
    let decoded = JSON.parse(atob(saveSnippet[0].saved));
    //store updated save object in the global context and localstorage
    auth.userData.saved = decoded;
    localStorage.setItem("userData", JSON.stringify(auth.userData));
    setAuth({
      ...auth,
      isAuthenticated: true,
      userData: auth.userData,
    });
  };

  const skeleton = Array.apply(null, Array(20)).map(function () {});

  return (
    <>
      {snippetDisplayStore.snippetViewerObject &&
      snippetDisplayStore.snippetViewerObject.id !== undefined ? (
        <section className={styles.wrapper}>
          <div className={styles.contentContainer}>
            <div className={styles.subcontent}>
              <div className={styles.snippetInfo}>
                <FaArrowLeft className={styles.goBackMobile} onClick={goBack} />
                <FaArrowLeft className={styles.goBack} onClick={goBack} />
                <div className={styles.userWrap}>
                  <Avatar
                    size={50}
                    name={`${snippetDisplayStore.snippetViewerObject.user_id}`}
                    variant="beam"
                    square={true}
                  />
                  <div className={styles.userTextWrap}>
                    <h1 className={styles.title}>
                      {snippetDisplayStore.snippetViewerObject.title}
                    </h1>
                    <p className={styles.author}>
                      {snippetDisplayStore.snippetViewerObject.author}
                    </p>
                  </div>
                </div>
                <div className={styles.snippetInfoItem}>
                  <div className={styles.language}>
                    <p className={styles.language}>
                      {snippetDisplayStore.snippetViewerObject.language}
                    </p>
                  </div>
                  <p className={styles.date}>
                    {snippetDisplayStore.snippetViewerObject.created_at
                      .split("")
                      .splice(0, 10)}
                  </p>
                </div>
                <div className={styles.likesWrap}>
                  <FaHeart />
                  <p>{snippetDisplayStore.snippetViewerObject.likes}</p>
                </div>
              </div>
              <div className={styles.headerButtons}>
                <div className={styles.headerButtonWrap}>
                  {auth.userData.id ===
                  snippetDisplayStore.snippetViewerObject.user_id ? null : auth
                      .userData.saved !== null ? (
                    Object.values(auth.userData.saved).includes(
                      snippetDisplayStore.snippetViewerObject.id
                    ) ? (
                      <div className={styles.actionWrap}>
                        <FaCheck className={styles.active} />
                        <h3 className={styles["header-icon-label"]}>Saved</h3>
                      </div>
                    ) : (
                      <div
                        className={styles.actionWrap}
                        onClick={handleSaveSnippet}
                      >
                        <FaStar className={styles["header-icon-delete"]} />
                        <h3 className={styles["header-icon-label"]}>Save</h3>
                      </div>
                    )
                  ) : (
                    <div
                      className={styles.actionWrap}
                      onClick={handleSaveSnippet}
                    >
                      <FaStar className={styles["header-icon-delete"]} />
                      <h3 className={styles["header-icon-label"]}>Save</h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles["main-content"]}>
              <div className={styles.sandpackWrap}>
                <SandpackProvider
                  theme={{
                    colors: {
                      surface1: "#1b1b1b",
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
                  template={snippetDisplayStore.snippetViewerObject.language}
                  customSetup={{
                    files: snippetDisplayStore.snippetViewerObject.code_snippet,
                  }}
                >
                  <div className={styles.editorLayout}>
                    <div className={styles.explorer}>
                      <SandpackFileExplorer />
                    </div>
                    <div className={styles.explorerWrapMobile}>
                      {explorerOpen ? (
                        <>
                          <p
                            onClick={toggleExplorer}
                            className={styles.explorerToggle}
                          >
                            Close Explorer
                          </p>
                          <div className={styles.explorerMobile}>
                            <p
                              onClick={toggleExplorer}
                              className={styles.explorerToggle}
                            >
                              Close Explorer
                            </p>
                            <SandpackFileExplorer />
                          </div>
                        </>
                      ) : (
                        <p
                          onClick={toggleExplorer}
                          className={styles.explorerToggle}
                        >
                          Open Explorer
                        </p>
                      )}
                    </div>
                    <div className={styles.filesWrap}>
                      <SandpackCodeViewer />
                      <SandpackPreview />
                    </div>
                  </div>
                </SandpackProvider>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          {skeleton.map((e, i) => {
            console.log(e, "JERE");
            return <SnippetSkeleton />;
          })}
        </>
      )}
    </>
  );
}
export default SnippetViewer;
