import React, { useContext } from "react";
import styles from "../Header/Header.module.css";
import { AuthWrap } from "../../context/AuthWrap";
import Avatar from "boring-avatars";
import Searchbar from "../Searchbar/Searchbar";
import { ReactComponent as Logo } from "../../assets/logo.svg";

function Header() {
  const { auth } = useContext(AuthWrap);
  console.log(auth.userData.id, "ID");
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
            <span className={styles.avatarWrap}>
              <Avatar
                size={35}
                name={`${auth.userData.id}`}
                variant="beam"
                square={true}
                className={styles.avatar}
              />
            </span>
            <p className={styles.username}>{auth.userData.username}</p>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Header;
