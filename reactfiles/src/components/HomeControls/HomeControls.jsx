import React from "react";
import styles from "./HomeControls.module.css";
import { BackspaceIcon } from "@heroicons/react/24/solid";

function Controls() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.filterSearch}>
        <input className={styles.input} type="text" placeholder="Filter..." />
        <BackspaceIcon className={styles.icon} />
      </div>
      <div className={styles.filterToggles}>
        <p className={styles.filterToggle}>Recents</p>
        <p className={styles.filterToggle}>Most Liked</p>
        <p className={styles.filterToggle}>Public</p>
        <p className={styles.filterToggle}>Private</p>
      </div>
    </div>
  );
}

export default Controls;
