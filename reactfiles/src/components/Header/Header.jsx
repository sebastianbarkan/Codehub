import React, { useState, useEffect, useContext } from "react";
import styles from "../Header/Header.module.css";
import { useLocation } from "react-router-dom";
import { query, SearchContext, setQuery } from "../../context/SearchContext";
import { AuthWrap } from "../../context/AuthWrap";
import Avatar from "boring-avatars";
import Searchbar from "../Searchbar/Searchbar";
import { ReactComponent as Logo } from "../../assets/logo.svg";

function Header() {
  const location = useLocation();
  const { auth } = useContext(AuthWrap);
  const { query, setQuery } = useContext(SearchContext);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.section}>
          <h1 className={styles.title}>Coderhub</h1>
          <Logo />
          <Searchbar />
        </div>
        {auth.userData ? (
          <div className={styles.userWrap}>
            <Avatar
              size={30}
              name={`${auth.userData.id}`}
              variant="beam"
              square={true}
              className={styles.avatar}
            />
            <p className={styles.username}>{auth.userData.username}</p>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Header;
