import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "../styles/pages/CreateSnippet.module.css";
import CreateSnippetForm from "../components/CreateSnippetForm/CreateSnippetForm.jsx";
import { AuthWrap } from "../context/AuthWrap";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
function CreateSnippet() {
  const [createSnippet, setCreateSnippet] = useState(false);

  const runCreateSnippet = () => {
    setCreateSnippet(true);
  };

  const { auth } = useContext(AuthWrap);
  let navigate = useNavigate();

  useEffect(() => {
    console.log(auth, "CREATE");
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
          <Header runCreateSnippet={runCreateSnippet}></Header>
          <div className={styles.contentWrap}>
            <CreateSnippetForm
              createSnippet={createSnippet}
              setCreateSnippet={setCreateSnippet}
            ></CreateSnippetForm>
          </div>
        </div>
      </section>
    </>
  );
}

export default CreateSnippet;
