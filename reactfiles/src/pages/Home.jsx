import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import HomeSnippets from "../components/HomeSnippets/HomeSnippets";
import { useContext } from "react";
import { AuthWrap } from "../context/AuthWrap";
import { useNavigate } from "react-router-dom";
import SnippetDisplay from "../components/SnippetDisplay/SnippetDisplay";
import styles from "../styles/pages/Home.module.css";
import Header from "../components/Header/Header";
import { useState } from "react";

function Home() {
  const { auth } = useContext(AuthWrap);
  const [editActive, setEditActive] = useState(false);
  const [saveEditModal, setSaveEditModal] = useState(false);
  const [link, setLink] = useState("");
  const [sidebarActive, setSidebarActive] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate("/login");
    }
  }, [auth.isAuthenticated, auth.userData]);

  const updateActiveEdit = () => {
    setEditActive(true);
  };

  const cancelActiveEdit = () => {
    setEditActive(false);
  };

  const updateSaveEditModal = () => {
    if (editActive) {
      setSaveEditModal(true);
    }
  };

  const cancelSaveEditModal = () => {
    setSaveEditModal(false);
  };

  const updateLink = (route) => {
    setLink(route);
  };

  return (
    <>
      <section className={styles.wrapper}>
        <Sidebar
          editActive={editActive}
          updateSaveEditModal={updateSaveEditModal}
          updateLink={updateLink}
        ></Sidebar>
        <div className={styles.container}>
          <Header></Header>
          <div className={styles["content-wrapper"]}>
            <HomeSnippets></HomeSnippets>
            <SnippetDisplay
              updateActiveEdit={updateActiveEdit}
              cancelActiveEdit={cancelActiveEdit}
              link={link}
              saveEditModal={saveEditModal}
              cancelSaveEditModal={cancelSaveEditModal}
            ></SnippetDisplay>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
