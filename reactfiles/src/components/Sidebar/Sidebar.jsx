import React, { useContext } from "react";
import {
  FaPlusCircle,
  FaSearch,
  FaLayerGroup,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthWrap } from "../../context/AuthWrap";
import styles from "./Sidebar.module.css";
import baseUrl from "../../api/backendfiles";

function Sidebar({ editActive, updateSaveEditModal, updateLink }) {
  const { setAuth } = useContext(AuthWrap);
  let navigate = useNavigate();
  let location = useLocation();

  const logout = (e) => {
    e.preventDefault();
    try {
      fetch(`${baseUrl}/logout`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.text();
        })
        .then((data) => {
          if (data === "success") {
            setAuth({
              isAuthenticated: false,
              userData: undefined,
            });
            localStorage.clear();
            navigate("/login");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles["top-links"]}>
          <Link
            to="/home"
            preventScrollReset={true}
            className={
              location.pathname === "/home" ? styles.linkSelected : styles.link
            }
          >
            <FaLayerGroup
              id="firstSidebarItem"
              className={`${styles["sidebar-icon"]} ${styles["sidebar-item"]}`}
            />
          </Link>
          <Link
            to={editActive ? "#" : "/createsnippet"}
            onClick={() => {
              if (editActive) {
                updateSaveEditModal();
                updateLink("/createsnippet");
              }
            }}
            preventScrollReset={true}
            className={
              location.pathname === "/createsnippet"
                ? styles.linkSelected
                : styles.link
            }
          >
            <FaPlusCircle
              className={`${styles["sidebar-icon"]} ${styles["sidebar-item"]}`}
            />
          </Link>
          <Link
            to={editActive ? "#" : "/searchsnippets"}
            onClick={() => {
              if (editActive) {
                updateSaveEditModal();
                updateLink("/searchsnippets");
              }
            }}
            preventScrollReset={true}
            className={
              location.pathname === "/searchsnippets"
                ? styles.linkSelected
                : styles.link
            }
          >
            <FaSearch
              className={`${styles["sidebar-icon"]} ${styles["sidebar-item"]}`}
            />
          </Link>
        </div>

        <div className={styles["bottom-links"]}>
          <FaSignOutAlt
            id="lastSidebarItem"
            className={`${styles["sidebar-icon"]} ${styles["sidebar-item"]}`}
            onClick={(e) => {
              if (editActive) {
                updateSaveEditModal();
              } else {
                logout(e);
              }
            }}
          />
        </div>
      </section>
    </>
  );
}

export default Sidebar;
