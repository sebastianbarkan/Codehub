import React, { useState } from "react";
import UserSnippetsSearch from "../UserSnippetSearch/UserSnippetsSearch";
import styles from "./HomeSnippets.module.css";
import HomeSnippetDisplay from "../HomeSnippetDisplay/HomeSnippetDisplay";
import { FaArrowLeft } from "react-icons/fa";

function HomeSnippets() {
  const [showSidebar, setShowSidebar] = useState(true);

  const handleToggle = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={showSidebar ? styles.sidebar : styles.sidebarHidden}>
          <UserSnippetsSearch></UserSnippetsSearch>
          <HomeSnippetDisplay></HomeSnippetDisplay>
        </div>
        {showSidebar ? (
          <div className={styles.sidebarToggle} onClick={handleToggle}>
            <FaArrowLeft className={styles.toggle} />
          </div>
        ) : (
          <div className={styles.sidebarToggleIn} onClick={handleToggle}>
            <FaArrowLeft className={styles.toggleFlip} />
          </div>
        )}
      </div>
    </>
  );
}

export default HomeSnippets;
