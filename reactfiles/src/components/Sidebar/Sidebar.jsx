import React, { useContext } from "react";
import {
  ArrowRightOnRectangleIcon,
  Square3Stack3DIcon,
  PlusCircleIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
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
        <div className={styles.section}>
          <Link
            to="/home"
            preventScrollReset={true}
            className={
              location.pathname === "/home" ? styles.linkSelected : styles.link
            }
          >
            <HomeIcon className={styles.icon} />
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
            <PlusCircleIcon className={styles.icon} />
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
            <Square3Stack3DIcon className={styles.icon} />
          </Link>
        </div>

        <div className={styles.section}>
          <p
            className={styles.link}
            onClick={(e) => {
              if (editActive) {
                updateSaveEditModal();
              } else {
                logout(e);
              }
            }}
          >
            <ArrowRightOnRectangleIcon className={styles.icon} />
          </p>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
