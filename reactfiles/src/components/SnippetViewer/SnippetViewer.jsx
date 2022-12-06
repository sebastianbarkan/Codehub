import React, { useState } from "react";
import { FaStar, FaArrowLeft, FaHeart, FaCheck } from "react-icons/fa";
import styles from "./SnippetViewer.module.css";
import { SnippetContext } from "../../context/SnippetContext";
import { SnippetDisplayContext } from "../../context/SnippetDisplayContext";
import { useContext, useRef } from "react";
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
import baseUrl from "../../api/backendfiles";

function SnippetViewer() {
  const { snippetDisplayStore, setSnippetDisplayStore } = useContext(
    SnippetDisplayContext
  );

  const { auth, setAuth } = useContext(AuthWrap);

  const [explorerOpen, setExplorerOpen] = useState(false);
  const toggleExplorer = () => {
    setExplorerOpen(!explorerOpen);
  };
  let navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const saveSnippet = (e) => {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    let saved;

    if (auth.userData.saved === null) {
      let key = snippetDisplayStore.snippetViewerObject.id;
      saved = {
        [key]: key,
      };
    } else {
      for (let i in auth.userData.saved) {
        if (i === snippetDisplayStore.snippetViewerObject.id) {
          return null;
        }
      }
      auth.userData.saved[snippetDisplayStore.snippetViewerObject.id] =
        snippetDisplayStore.snippetViewerObject.id;

      saved = auth.userData.saved;
    }

    try {
      fetch(`${baseUrl}/api/snippets/saveSnippet`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          { id: snippetDisplayStore.snippetViewerObject.id },
          saved,
          auth.userData.id,
        ]),
      })
        .then((res) => res.json())
        .then((data) => {
          let decoded = JSON.parse(atob(data[0].saved));
          auth.userData.saved = decoded;
          localStorage.setItem("userData", JSON.stringify(auth.userData));
          setAuth({
            ...auth,
            isAuthenticated: true,
            userData: auth.userData,
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {snippetDisplayStore.snippetViewerObject &&
      snippetDisplayStore.snippetViewerObject.id !== undefined ? (
        <section className={styles.wrapper}>
          {console.log(snippetDisplayStore, "snippetDisplayStore")}
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
                      <div className={styles.actionWrap} onClick={saveSnippet}>
                        <FaStar className={styles["header-icon-delete"]} />
                        <h3 className={styles["header-icon-label"]}>Save</h3>
                      </div>
                    )
                  ) : (
                    <div className={styles.actionWrap} onClick={saveSnippet}>
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
        <div className={styles.loadingWrap}>
          <Oval
            height={80}
            width={80}
            color="#07ffc5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#07ffc5"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
    </>
  );
}
export default SnippetViewer;
