import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import styles from "../styles/pages/SnippetDisplay.module.css";
import Snippet from "../components/Snippet/Snippet";

function SnippetDisplay() {
  return (
    <>
      <section className={styles.wrapper}>
        <Sidebar />
        <div className={styles.contentWrap}>
          <Header />
          <Snippet
            getKey={(location) => {
              return location.pathname;
            }}
          />
        </div>
      </section>
    </>
  );
}

export default SnippetDisplay;
