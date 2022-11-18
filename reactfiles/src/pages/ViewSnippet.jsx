import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import styles from "../styles/pages/ViewSnippet.module.css";
import SnippetViewer from "../components/SnippetViewer/SnippetViewer";

function ViewSnippet() {
  return (
    <>
      <section className={styles.wrapper}>
        <Sidebar />
        <div className={styles.contentWrap}>
          <Header />
          <SnippetViewer
            getKey={(location, matches) => {
              return location.pathname;
            }}
          />
        </div>
      </section>
    </>
  );
}

export default ViewSnippet;
