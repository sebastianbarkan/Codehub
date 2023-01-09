import React, { useContext, useState } from "react";
import {
  Square3Stack3DIcon,
  CodeBracketIcon,
  ClockIcon,
  HeartIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  BookmarkSquareIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import styles from "../SnippetHeader/SnippetHeader.module.css";
import { SnippetDisplayContext } from "../../context/SnippetDisplayContext";
import getFormattedDate from "../../utilities/getFormattedDate";
import DeleteSnippet from "../../utilities/deleteSnippet";

function SnippetHeader({
  setEditActive,
  editActive,
  title,
  setTitle,
  handleUpdateSnippet,
}) {
  const { snippetDisplayStore } = useContext(SnippetDisplayContext);
  const [editTitle, setEditTitle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  let formattedDate;

  if (snippetDisplayStore.snippetObject !== undefined) {
    let date = snippetDisplayStore.snippetObject.created_at;
    formattedDate = getFormattedDate(date);
  }

  const handleDeleteSnippet = async () => {
    //send snippet id to backend and database for deletion
    const deleteSnippet = await DeleteSnippet(
      snippetDisplayStore.snippetObject.id
    );
    //refresh snippet and hide modal if deletion was success
    if (deleteSnippet.status === 200) {
      window.location.reload();
    }
  };

  return (
    <div className={styles.wrapper}>
      {deleteModal ? (
        <section className={styles.modalWrap}>
          <div className={styles.deleteModal}>
            <p className={styles.deleteModalPrompt}>Delete this snippet?</p>
            <div className={styles.deleteModalActions}>
              <button
                className={styles.confirmButton}
                onClick={handleDeleteSnippet}
              >
                Confirm
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      ) : null}
      {snippetDisplayStore.snippetObject !== undefined ? (
        <>
          <div className={styles.section}>
            <Square3Stack3DIcon className={styles.codeIcon} />
            <span className={styles.authorSpan}>
              /{snippetDisplayStore.snippetObject.author}/
            </span>
            {editActive ? (
              editTitle ? (
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
                      localStorage.setItem("titleEdit", title);
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
              )
            ) : (
              <p className={styles.snippetTitle}>{title}</p>
            )}
          </div>

          <div className={`${styles.section} ${styles.centerSection}`}>
            <span className={styles.sectionSpan}>
              <CodeBracketIcon className={styles.codeIcon} />
              <p>{snippetDisplayStore.snippetObject.language}</p>
            </span>

            <span className={styles.sectionSpan}>
              <ClockIcon className={styles.codeIcon} />
              <p>{formattedDate}</p>
            </span>

            <span className={styles.sectionSpan}>
              <HeartIcon className={styles.codeIcon} />
              <p>{snippetDisplayStore.snippetObject.likes}</p>
            </span>
            <span className={styles.sectionSpan}>
              <EyeIcon className={styles.codeIcon} />
              <p>
                {snippetDisplayStore.snippetObject.public === 1
                  ? "Public"
                  : "Private"}
              </p>
            </span>
          </div>

          <div className={`${styles.section} ${styles.buttonSection}`}>
            {editActive ? (
              <button
                className={styles.editButton}
                onClick={() => {
                  handleUpdateSnippet();
                }}
              >
                <BookmarkSquareIcon className={styles.saveIcon} />
                <label className={styles.buttonLabel}>Save Changes</label>
              </button>
            ) : (
              <button
                className={styles.editButton}
                onClick={() => setEditActive(!editActive)}
              >
                <PencilSquareIcon className={styles.editIcon} />
                <label className={styles.buttonLabel}>Edit</label>
              </button>
            )}
            <button
              className={styles.deleteButton}
              onClick={() => setDeleteModal(true)}
            >
              <TrashIcon className={styles.trashIcon} />
              <label className={styles.buttonLabel}>Delete</label>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default SnippetHeader;
