import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "../styles/pages/CreateSnippet.module.css";
import CreateSnippetForm from "../components/CreateSnippetForm/CreateSnippetForm.jsx";
import { AuthWrap } from "../context/AuthWrap";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
function CreateSnippet() {
  const { auth } = useContext(AuthWrap);
  let navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate("/login");
    } else if (auth.userData === null) {
      navigate("/login");
    }
  }, [auth.isAuthenticated, auth.userData]);

  return (
    <>
      <section className={styles.wrapper}>
        <Sidebar />
        <div className={styles.container}>
          <Header></Header>
          <div className={styles.contentWrap}>
            <CreateSnippetForm></CreateSnippetForm>
          </div>
        </div>
      </section>
    </>
  );
}

export default CreateSnippet;
