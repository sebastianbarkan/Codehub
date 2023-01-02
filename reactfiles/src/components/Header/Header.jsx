import React, { useState, useEffect, useContext } from "react";
import styles from "../Header/Header.module.css";
import { useLocation } from "react-router-dom";
import { query, SearchContext, setQuery } from "../../context/SearchContext";
import { AuthWrap } from "../../context/AuthWrap";
import Avatar from "boring-avatars";
import Searchbar from "../Searchbar/Searchbar";

function Header() {
  const location = useLocation();
  const { auth } = useContext(AuthWrap);
  const { query, setQuery } = useContext(SearchContext);

  return (
    <>
      {location.pathname === "/home" ? (
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Home</h1>
          {/*check if there is correct userdata before displaying info */}
          <div className={styles.infoWrapper}>
            <Searchbar />
            {auth.userData ? (
              <div className={styles.userWrap}>
                <Avatar
                  size={30}
                  name={`${auth.userData.id}`}
                  variant="beam"
                  square={true}
                />
                <p className={styles.username}>{auth.userData.username}</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : location.pathname === "/createsnippet" ? (
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Create a Snippet</h1>
          {/*check if there is correct userdata before displaying info */}
          <div className={styles.infoWrapper}>
            <Searchbar />
            {auth.userData ? (
              <div className={styles.userWrap}>
                <Avatar
                  size={30}
                  name={`${auth.userData.id}`}
                  variant="beam"
                  square={true}
                />
                <p className={styles.username}>{auth.userData.username}</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Browse Snippets</h1>
          {/*check if there is correct userdata before displaying info */}
          <div className={styles.infoWrapper}>
            <Searchbar />
            {auth.userData ? (
              <div className={styles.userWrap}>
                <Avatar
                  size={30}
                  name={`${auth.userData.id}`}
                  variant="beam"
                  square={true}
                />
                <p className={styles.username}>{auth.userData.username}</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
