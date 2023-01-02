import React, { useContext, useState } from "react";
import styles from "./SnippetShowCase.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { SnippetDisplayContext } from "../../context/SnippetDisplayContext";
import { FaStar, FaHeart, FaCheck } from "react-icons/fa";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { AuthWrap } from "../../context/AuthWrap";
import Avatar from "boring-avatars";
import { useEffect } from "react";
import baseUrl from "../../api/backendfiles";
import SaveSnippet from "../../utilities/saveSnippet";
import LikeSnippet from "../../utilities/likeSnippet";

function SnippetShowCase(props) {
  let navigate = useNavigate();
  let location = useLocation();
  let dateArr = props.info.created_at.split("");
  let dateFormat = dateArr.splice(0, 10);
  const [likes, setLikes] = useState(props.info.likes);
  const { snippetDisplayStore, setSnippetDisplayStore } = useContext(
    SnippetDisplayContext
  );

  const { auth, setAuth } = useContext(AuthWrap);
  useEffect(() => {
    setLikes(props.info.likes);
  }, [props.likeSort]);

  const handleLikeSnippet = async (e) => {
    //stop propogation to only trigger like function
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    let liked;
    //check if liked object is null
    if (auth.userData.liked === null) {
      //if it is then create new object and add current snippet
      let key = props.info.id;
      liked = {
        [key]: key,
      };
    } else {
      //if not null then check to make sure its not already saved
      for (let i in auth.userData.liked) {
        if (i === props.info.id) {
          return null;
        }
      }
      //then add it to the saved object
      auth.userData.liked[props.info.id] = props.info.id;
      liked = auth.userData.liked;
    }
    // send the updated like object to the backend and database
    const likedSnippets = await LikeSnippet(
      props.info.id,
      liked,
      auth.userData.id
    );
    //decode response by and parse it to json
    let decoded = JSON.parse(atob(likedSnippets[0].liked));
    //store updated save object in the global context and localstorage
    auth.userData.liked = decoded;
    localStorage.setItem("userData", JSON.stringify(auth.userData));
    setAuth({
      ...auth,
      isAuthenticated: true,
      userData: auth.userData,
    });
    setLikes(props.info.likes + 1);
  };

  const stopPropagation = (e) => {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  };

  const handleSaveSnippet = async (e) => {
    //stop propogation to only trigger save function
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    let saved;
    //check if saved object is null
    if (auth.userData.saved === null) {
      //if it is then create new object and add current snippet
      let key = props.info.id;
      saved = {
        [key]: key,
      };
    } else {
      //if not null then check to make sure its not already saved
      for (let i in auth.userData.saved) {
        if (i === props.info.id) {
          return null;
        }
      }
      //then add it to the saved object
      auth.userData.saved[props.info.id] = props.info.id;
      saved = auth.userData.saved;
    }
    //send the updated saved object to backend and database
    const saveSnippet = await SaveSnippet(saved, auth.userData.id);
    //decode response by and parse it to json
    let decoded = JSON.parse(atob(saveSnippet[0].saved));
    //store updated save object in the global context and localstorage
    auth.userData.saved = decoded;
    localStorage.setItem("userData", JSON.stringify(auth.userData));
    setAuth({
      ...auth,
      isAuthenticated: true,
      userData: auth.userData,
    });
  };

  return (
    <>
      <div
        className={
          location.pathname === "/searchsnippets"
            ? styles.searchWrapper
            : snippetDisplayStore.snippetObject === undefined ||
              snippetDisplayStore.snippetObject === null
            ? styles.wrapper
            : snippetDisplayStore.snippetObject.id === props.info.id
            ? styles.selectedWrapper
            : styles.wrapper
        }
        onClick={() => {
          if (location.pathname !== "/home") {
            setSnippetDisplayStore({
              ...snippetDisplayStore,
              snippetViewerObject: props.info,
            });
            navigate(`/viewsnippet/${props.info.title}`);
          } else {
            localStorage.setItem(
              "snippetDisplayArray",
              JSON.stringify(props.info)
            );
            setSnippetDisplayStore({
              ...snippetDisplayStore,
              snippetObject: JSON.parse(
                localStorage.getItem("snippetDisplayArray")
              ),
            });
          }
        }}
      >
        {location.pathname !== "/home" ? (
          <>
            <div className={styles.rightWrap}>
              <div className={styles.header}>
                <h1 className={styles.title}>{props.info.title}</h1>
              </div>
              <div className={styles.subheader}>
                <div className={styles.userWrap}>
                  <Avatar
                    size={25}
                    name={`${props.info.user_id}`}
                    variant="beam"
                    square={true}
                  />
                  <p className={styles.author}>{props.info.author}</p>
                </div>
                <p className={styles.date}>{dateFormat}</p>
              </div>
            </div>
            <div className={styles.codeWrap}>
              <SandpackProvider
                template={props.info.language}
                files={props.info.code_snippet}
              >
                <SandpackLayout>
                  <SandpackPreview />
                </SandpackLayout>
              </SandpackProvider>
            </div>

            <div className={styles.actionsWrap}>
              <div className={styles.buttonWrap}>
                {auth.userData.liked !== null ? (
                  Object.values(auth.userData.liked).includes(props.info.id) ? (
                    <div
                      className={styles.actionWrap}
                      onClick={stopPropagation}
                    >
                      <FaHeart
                        className={`${styles.actionIcon} ${styles.active}`}
                      />
                      <p className={styles.active}>{likes}</p>
                    </div>
                  ) : (
                    <div
                      className={styles.actionWrap}
                      onClick={handleLikeSnippet}
                    >
                      <FaHeart className={styles.actionIcon} />
                      <p>{likes}</p>
                    </div>
                  )
                ) : (
                  <div
                    className={styles.actionWrap}
                    onClick={handleLikeSnippet}
                  >
                    <FaHeart className={styles.actionIcon} />
                    <p>{likes}</p>
                  </div>
                )}
                {auth.userData.id === props.info.user_id ? null : auth.userData
                    .saved !== null ? (
                  Object.values(auth.userData.saved).includes(props.info.id) ? (
                    <div
                      className={styles.actionWrap}
                      onClick={stopPropagation}
                    >
                      <FaCheck
                        className={`${styles.actionIcon} ${styles.active}`}
                      />
                      <p className={styles.active}>Saved</p>
                    </div>
                  ) : (
                    <div
                      className={styles.actionWrap}
                      onClick={handleSaveSnippet}
                    >
                      <FaStar className={styles.actionIcon} />
                      <p className={styles.actionLabel}>Save</p>
                    </div>
                  )
                ) : (
                  <div
                    className={styles.actionWrap}
                    onClick={handleSaveSnippet}
                  >
                    <FaStar className={styles.actionIcon} />
                    <p className={styles.actionLabel}>Save</p>
                  </div>
                )}
              </div>
              <p className={styles.language}>{props.info.language}</p>
            </div>
          </>
        ) : (
          <>
            <div className={styles.rightWrap}>
              <div className={styles.header}>
                <h1 className={styles.title}>{props.info.title}</h1>
              </div>
              <div className={styles.subheader}>
                <div className={styles.userWrap}>
                  <Avatar
                    size={25}
                    name={`${props.info.user_id}`}
                    variant="beam"
                    square={true}
                  />
                  <p className={styles.author}>{props.info.author}</p>
                </div>
                <p className={styles.date}>{dateFormat}</p>
              </div>
            </div>

            <SandpackProvider
              template={props.info.language}
              files={props.info.code_snippet}
            >
              <SandpackLayout>
                <SandpackPreview />
              </SandpackLayout>
            </SandpackProvider>

            <div className={styles.actionsWrapHome}>
              <div className={styles.likesWrap}>
                <FaHeart className={styles.actionIcon} />
                <p>{props.info.likes}</p>
              </div>
              <p className={styles.language}>{props.info.language}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SnippetShowCase;
