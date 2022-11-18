import React from "react";
import styles from "../DeleteModal/DeleteModal.module.css";

function DeleteModal(props) {
  return (
    <>
      <div className={styles.wrapper} id="unblurred">
        <h1 className={styles.prompt}>
          Are you sure you want to delete this snippet?
        </h1>
        <div className={styles.buttonWrap}>
          <button onClick={props.confirmDelete} className={styles.confirm}>
            Confirm
          </button>
          <button onClick={props.cancelDelete} className={styles.cancel}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default DeleteModal;
