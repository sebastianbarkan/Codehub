import React, { useContext, useState } from "react";
import {
  Square3Stack3DIcon,
  CodeBracketIcon,
  PencilIcon,
  CheckIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import styles from "../SnippetEditorHeader/SnippetEditorHeader.module.css";
import { AuthWrap } from "../../context/AuthWrap";

function SnippetEditorHeader({
  title,
  setTitle,
  privacy,
  setPrivacy,
  language,
  setLanguage,
  languageOptions,
  createSnippet,
  existsWarning,
  lengthWarning,
}) {
  const [editTitle, setEditTitle] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const { auth } = useContext(AuthWrap);

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <Square3Stack3DIcon className={styles.icon} />
        <span className={styles.authorSpan}>
          /{auth.userData.username}/
          {editTitle ? (
            <div className={styles.editWrapper}>
              <input
                placeholder={title}
                className={styles.titleInput}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              ></input>
              <CheckIcon
                className={styles.confirmEditTitleIcon}
                onClick={() => {
                  localStorage.setItem("title", title);
                  setEditTitle(false);
                }}
              />
            </div>
          ) : (
            <>
              <p className={styles.snippetTitle}>{title}</p>
              <PencilIcon
                className={styles.editTitleIcon}
                onClick={() => setEditTitle(true)}
              />
            </>
          )}
        </span>
        <div className={styles.titleWarnings}>
          {lengthWarning ? (
            <p className={styles.titleWarning}>Please enter a title</p>
          ) : null}
          {existsWarning ? (
            <p className={styles.titleWarning}>Title in use</p>
          ) : null}
        </div>
      </div>

      <div className={`${styles.section} ${styles.languageSection}`}>
        <div className={styles.languageContainer}>
          <span
            className={styles.languageSpan}
            onClick={() => {
              setShowLanguages(!showLanguages);
            }}
          >
            <CodeBracketIcon className={styles.codeIcon} />
            <p className={styles.languageInput}>{language}</p>
            {showLanguages ? (
              <ChevronUpIcon
                className={styles.chevronIcon}
                onClick={() => setShowLanguages(false)}
              />
            ) : (
              <ChevronDownIcon
                className={styles.chevronIcon}
                onClick={() => setShowLanguages(true)}
              />
            )}
          </span>
          {showLanguages ? (
            <div className={styles.languageDropdownWrap}>
              <ul className={styles.languageDropdown}>
                {languageOptions.map((e, i) => {
                  return (
                    <li
                      className={styles.languageItem}
                      onClick={() => {
                        setLanguage(e.value);
                        setShowLanguages(false);
                      }}
                    >
                      <p>{e.label}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className={`${styles.section} ${styles.buttonSection}`}>
        <div className={styles.privacyWrap}>
          <p>Private</p>
          <label className={styles.switch}>
            <input
              type="checkbox"
              value={privacy}
              onClick={() => setPrivacy(!privacy)}
              className={styles.privacyInput}
            ></input>
            <span className={`${styles.slider} ${styles.round}`}></span>
          </label>
        </div>
        <button className={styles.createButton} onClick={createSnippet}>
          <PlusCircleIcon className={styles.createIcon} />
          Create Snippet
        </button>
      </div>
    </div>
  );
}

export default SnippetEditorHeader;
