import React, { useState, useEffect, useContext } from "react";
import styles from "../Header/Header.module.css";
import { useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Fuse from "fuse.js";
import { AuthWrap } from "../../context/AuthWrap";
import Avatar from "boring-avatars";

function Header() {
  const location = useLocation();
  const { auth } = useContext(AuthWrap);

  return (
    <>
      {location.pathname === "/home" ? (
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Home</h1>
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
      ) : location.pathname === "/createsnippet" ? (
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Create a Snippet</h1>
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
      ) : (
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Browse Snippets</h1>
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
      )}
    </>
  );
}

export default Header;
