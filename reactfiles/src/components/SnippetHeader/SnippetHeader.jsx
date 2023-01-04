import React from "react";
import { Square3Stack3DIcon } from "@heroicons/react/24/solid";
import styles from "../SnippetHeader/SnippetHeader.module.css";

function SnippetHeader(props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.authorWrap}>
        <Square3Stack3DIcon className={styles.icon} />
        <span className={styles.authorSpan}>
          /{props.username}/<p className={styles.snippetTitle}>Untitled</p>
        </span>
      </div>

      <div className={styles.mainInfoWrap}>
        <div className={styles.mainInfoItem}></div>
        <div className={styles.mainInfoItem}></div>
        <div className={styles.mainInfoItem}></div>
        <div className={styles.mainInfoItem}></div>
      </div>
      <div className={styles.actionsWrap}></div>
    </div>
  );
}

export default SnippetHeader;
