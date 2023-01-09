import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { useContext } from "react";
import { AuthWrap } from "../context/AuthWrap";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/Home.module.css";
import Header from "../components/Header/Header";
import { useState } from "react";
import HomeControls from "../components/HomeControls/HomeControls";
import HomeSnippetDisplay from "../components/HomeSnippetDisplay/HomeSnippetDisplay";
import { SearchContext } from "../context/SearchContext";

function Home() {
  const { auth } = useContext(AuthWrap);
  const [editActive, setEditActive] = useState(false);
  const [saveEditModal, setSaveEditModal] = useState(false);
  const [link, setLink] = useState("");
  const { homeSortValue, language } = useContext(SearchContext);

  const categorySort = (a, b) => {
    if (homeSortValue === "Recents") {
      return b.created_at - a.created_at;
    } else if (homeSortValue === "Likes") {
      return b.likes - a.likes;
    } else if (homeSortValue === "Public") {
      return a.public === 1;
    } else if (homeSortValue === "Private") {
      return a.public === 0;
    }
  };

  const languageFilter = (item, i) => {
    if (language === "All languages") {
      return item;
    } else if (language === item.language) {
      return item;
    }
  };

  let navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate("/login");
    }
  }, [auth.isAuthenticated, auth.userData]);

  const updateSaveEditModal = () => {
    if (editActive) {
      setSaveEditModal(true);
    }
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
          <div className={styles.contentWrap}>
            <HomeControls />
            <HomeSnippetDisplay
              categorySort={categorySort}
              languageFilter={languageFilter}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
