import React, { useContext, useState } from "react";
import {
  Square3Stack3DIcon,
  BookmarkSquareIcon,
  CodeBracketIcon,
  ClockIcon,
  HeartIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/solid";
import styles from "../SnippetViewerHeader/SnippetViewerHeader.module.css";
import { SnippetDisplayContext } from "../../context/SnippetDisplayContext";
import getFormattedDate from "../../utilities/getFormattedDate";
import { AuthWrap } from "../../context/AuthWrap";
import SaveSnippet from "../../utilities/saveSnippet";

function SnippetViewerHeader() {
  const { snippetDisplayStore } = useContext(SnippetDisplayContext);
  const { auth, setAuth } = useContext(AuthWrap);
  let date = new Date(snippetDisplayStore.snippetViewerObject.created_at); // some mock date
  let milliseconds = date.getTime();

  let formattedDate = getFormattedDate(milliseconds);

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

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <Square3Stack3DIcon className={styles.codeIcon} />
        <span className={styles.authorSpan}>
          /{snippetDisplayStore.snippetViewerObject.author}/
        </span>
        <p className={styles.snippetTitle}>
          {snippetDisplayStore.snippetViewerObject.title}
        </p>
      </div>

      <div className={`${styles.section} ${styles.centerSection}`}>
        <span className={styles.sectionSpan}>
          <ShieldExclamationIcon className={styles.readOnlyIcon} />
          <p className={styles.readOnly}>Read-only</p>
        </span>
        <span className={styles.sectionSpan}>
          <CodeBracketIcon className={styles.codeIcon} />
          <p>{snippetDisplayStore.snippetViewerObject.language}</p>
        </span>

        <span className={styles.sectionSpan}>
          <ClockIcon className={styles.codeIcon} />
          <p>{formattedDate}</p>
        </span>

        <span className={styles.sectionSpan}>
          <HeartIcon className={styles.codeIcon} />
          <p>{snippetDisplayStore.snippetViewerObject.likes}</p>
        </span>
      </div>

      <div className={`${styles.section} ${styles.buttonSection}`}>
        {auth.userData.saved !== null && auth.userData.liked !== undefined ? (
          <>
            Object.values(auth.userData.saved).includes(
            snippetDisplayStore.snippetViewerObject.id ) ? (
            <label className={styles.addedLabel}>Added</label>) : (
            <button className={styles.saveButton} onClick={handleSaveSnippet}>
              <BookmarkSquareIcon className={styles.icon} />
              <label className={styles.saveLabel}>Add to saved</label>
            </button>
            )
          </>
        ) : null}
      </div>
    </div>
  );
}

export default SnippetViewerHeader;
