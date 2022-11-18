import React from "react";
import styles from "../EditModal/EditModal.module.css";
import { useNavigate } from "react-router-dom";
function EditModal({ stayOnPage, link }) {
  let navigate = useNavigate();
  const leavePage = () => {
    navigate(link);
  };
  return (
    <>
      <div className={styles.wrapper} id="unblurred">
        <div className={styles.textWrap}>
          <h1 className={styles.prompt}>Leave page?</h1>
          <p className={styles.subPrompt}>You may have unsaved changes.</p>
        </div>
        <div className={styles.buttonWrap}>
          <button className={styles.confirm} onClick={leavePage}>
            Leave Page
          </button>
          <button onClick={stayOnPage} className={styles.cancel}>
            Stay on Page
          </button>
        </div>
      </div>
    </>
  );
}

export default EditModal;
