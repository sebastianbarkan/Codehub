import React from "react";
import styles from "../SnippetSkeleton/SnippetSkeleton.module.css";

function SnippetSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.topPlaceholder}></div>
      <div className={styles.bottomPlaceholder}></div>
    </div>
  );
}

export default SnippetSkeleton;
