import React, { useState } from "react";
import { FaPencilAlt, FaTrash, FaHeart, FaCheck } from "react-icons/fa";
import styles from "./SnippetDisplay.module.css";
import { SnippetContext } from "../../context/SnippetContext";
import { SnippetDisplayContext } from "../../context/SnippetDisplayContext";
import { useContext, useRef } from "react";
import { Oval } from "react-loader-spinner";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackCodeViewer,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { AuthWrap } from "../../context/AuthWrap";
import DeleteModal from "../DeleteModal/DeleteModal";
import EditModal from "../EditModal/EditModal";
import CodeEditor from "../Code/CodeEditor";
import Avatar from "boring-avatars";
import baseUrl from "../../api/backendfiles";
import DeleteSnippet from "../../utilities/deleteSnippet";
import UpdateSnippet from "../../utilities/updateSnippet";
import RemoveFromSaved from "../../utilities/removeFromSaved";

function SnippetDisplay({
  updateActiveEdit,
  cancelActiveEdit,
  saveEditModal,
  cancelSaveEditModal,
  link,
  sidebarActive,
}) {
  //define context and state values
  const { snippetDisplayStore } = useContext(SnippetDisplayContext);
  const { auth, setAuth } = useContext(AuthWrap);
  const [editActive, setEditActive] = useState(false);
  const modalWrap = useRef(null);
  const sidebar = useRef(null);
  const editModalWrap = useRef(null);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [code, setCode] = useState(``);
  const [showSaved, setShowSaved] = useState(false);
  const [showRemovedFromSave, setShowRemovedFromSave] = useState(false);
  const updateCode = (files) => {
    setCode(files);
  };

  const handleDeleteSnippet = async () => {
    //send snippet id to backend and database for deletion
    const deleteSnippet = await DeleteSnippet(
      snippetDisplayStore.snippetObject.id
    );
    //refresh snippet and hide modal if deletion was success
    if (deleteSnippet.status === 200) {
      window.location.reload();
      modalWrap.current.style.display = "none";
    }
  };

  const handleUpdateSnippet = async () => {
    //send snippet id and updated code to backend and database
    const updateSnippet = await UpdateSnippet(
      snippetDisplayStore.snippetObject.id,
      code
    );
    //check if update was success and show a success message to user
    if (updateSnippet === "updated") {
      cancelActiveEdit();
      setEditActive(false);
      setTimeout(() => {
        setShowSaved(false);
      }, 1000);
      setShowSaved(true);
    }
  };

  const handleRemoveFromSaved = async () => {
    //remove snippet from saved context object
    delete auth.userData.saved[snippetDisplayStore.snippetObject.id];

    //update database with new saved object
    const removeFromSaved = await RemoveFromSaved(
      auth.userData.id,
      auth.userData.saved
    );
    //show user snippet was removed and store the new saved object in context/localstorage
    setShowRemovedFromSave(true);
    let decoded = JSON.parse(atob(removeFromSaved[0].saved));
    auth.userData.saved = decoded;
    localStorage.setItem("userData", JSON.stringify(auth.userData));
    setAuth({
      ...auth,
      isAuthenticated: true,
      userData: auth.userData,
    });
    window.location.reload();
  };

  const cancelDelete = () => {
    modalWrap.current.style.display = "none";
  };

  const showModal = () => {
    modalWrap.current.style.display = "flex";
  };

  const handleEdit = () => {
    updateActiveEdit();
    setEditActive(true);
  };

  const cancelEdit = () => {
    cancelActiveEdit();
    setEditActive(false);
  };

  const toggleExplorer = () => {
    setExplorerOpen(!explorerOpen);
  };
  return (
    <>
      {showRemovedFromSave ? (
        <section className={styles.removedWrapper}>
          <div className={styles.removedWrap}>
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
            <p className={styles.removed}>Removing</p>
          </div>
        </section>
      ) : snippetDisplayStore.snippetObject &&
        snippetDisplayStore.snippetObject.id !== undefined ? (
        <section className={styles.wrapper}>
          <div className={styles.contentContainer}>
            <div className={styles["snippet-subcontent"]}>
              <div className={styles.snippetInfo}>
                <div className={styles.snippetInfoItem}>
                  <Avatar
                    size={50}
                    name={`${snippetDisplayStore.snippetObject.user_id}`}
                    variant="beam"
                    square={true}
                  />
                  <div className={styles.userTextWrap}>
                    <h1 className={styles["title"]}>
                      {snippetDisplayStore.snippetObject.title}
                    </h1>
                    <p className={styles["snippet-subcontent-author"]}>
                      {snippetDisplayStore.snippetObject.author}
                    </p>
                  </div>
                </div>
                <div className={styles.snippetInfoSubItem}>
                  <p className={styles["snippet-language"]}>
                    {snippetDisplayStore.snippetObject.language}
                  </p>
                  <div className={styles.dateWrap}>
                    {snippetDisplayStore.snippetObject.created_at
                      .split("")
                      .splice(0, 10)}
                  </div>
                </div>

                <div className={styles.likesWrap}>
                  <p className={styles.likes}>
                    {snippetDisplayStore.snippetObject.likes}
                  </p>
                  <FaHeart className={styles.likesIcon} />
                </div>
              </div>
              <div className={styles["snippet-header"]}>
                <div ref={modalWrap} className={styles.modalWrap}>
                  <DeleteModal
                    confirmDelete={handleDeleteSnippet}
                    cancelDelete={cancelDelete}
                  ></DeleteModal>
                </div>
                <div
                  ref={sidebar}
                  className={
                    sidebarActive
                      ? styles.sidebarModalWrap
                      : styles.sidebarModalWrapHidden
                  }
                ></div>
                <div
                  ref={editModalWrap}
                  className={
                    saveEditModal
                      ? styles.editModalWrap
                      : styles.editModalWrapHidden
                  }
                >
                  <EditModal
                    stayOnPage={cancelSaveEditModal}
                    link={link}
                  ></EditModal>
                </div>
              </div>
              <div className={styles.headerButtons}>
                {auth.userData.saved !== null &&
                Object.values(auth.userData.saved).includes(
                  snippetDisplayStore.snippetObject.id
                ) ? (
                  <div className={styles.headerButtonWrap}>
                    <FaTrash
                      className={styles["header-icon-delete"]}
                      onClick={handleRemoveFromSaved}
                    />
                    <h3
                      className={styles["header-icon-label"]}
                      onClick={handleRemoveFromSaved}
                    >
                      Remove from saved
                    </h3>
                  </div>
                ) : (
                  <>
                    {showSaved ? (
                      <div className={styles.headerButtonWrap}>
                        <FaCheck className={styles["header-icon"]} />
                        <p className={styles["header-icon-label"]}>Saved</p>
                      </div>
                    ) : editActive ? (
                      <div className={styles.editActiveWrap}>
                        <button
                          className={styles.saveEdit}
                          onClick={handleUpdateSnippet}
                        >
                          Save{" "}
                          <span className={styles.changeSpan}>Changes</span>
                        </button>
                        <button
                          className={styles.cancelEdit}
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className={styles.headerButtonWrap}>
                        <FaPencilAlt
                          className={styles["header-icon"]}
                          onClick={handleEdit}
                        />
                        <h3
                          className={styles["header-icon-label"]}
                          onClick={handleEdit}
                        >
                          Edit
                        </h3>
                      </div>
                    )}
                    <div className={styles.headerButtonWrap}>
                      <FaTrash
                        className={styles["header-icon-delete"]}
                        onClick={showModal}
                      />
                      <h3
                        className={styles["header-icon-label"]}
                        onClick={showModal}
                      >
                        Delete
                      </h3>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles["main-content"]}>
              <SandpackProvider
                template={snippetDisplayStore.snippetObject.language}
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
                customSetup={{
                  files: snippetDisplayStore.snippetObject.code_snippet,
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
                    {editActive ? (
                      <CodeEditor updateCode={updateCode} />
                    ) : (
                      <SandpackCodeViewer />
                    )}
                    <SandpackPreview />
                  </div>
                </div>
              </SandpackProvider>
            </div>
          </div>
        </section>
      ) : (
        <div className={styles.loadingWrap}>
          <p className={styles.noSnippets}>You have no snippets</p>
        </div>
      )}
    </>
  );
}

export default SnippetDisplay;
