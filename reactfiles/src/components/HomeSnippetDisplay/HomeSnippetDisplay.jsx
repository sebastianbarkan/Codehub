import React, { useContext, useEffect } from "react";
import { SnippetContext } from "../../context/SnippetContext";
import { SearchContext } from "../../context/SearchContext";
import styles from "../HomeSnippetDisplay/HomeSnippetDisplay.module.css";
import SnippetShowCase from "../SnippetShowCase/SnippetShowCase";
import { AuthWrap } from "../../context/AuthWrap";
import Fuse from "fuse.js";
import { Oval } from "react-loader-spinner";
import { useNavigate, Link } from "react-router-dom";
import { SnippetDisplayContext } from "../../context/SnippetDisplayContext";
import baseUrl from "../../../api/backendfiles";

function HomeSnippetDisplay() {
  const { snippetStore, setSnippetStore } = useContext(SnippetContext);
  const { snippetDisplayStore, setSnippetDisplayStore } = useContext(
    SnippetDisplayContext
  );

  const { searchObject } = useContext(SearchContext);
  const { auth, setAuth } = useContext(AuthWrap);

  let navigate = useNavigate();
  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate("/login");
    }
  }, []);

  const searchFilter = (item, i) => {
    if (searchObject.search === "") {
      return item;
    } else {
      const options = {
        includeScore: true,
        useExtendedSearch: true,
        keys: ["title"],
      };

      const fuse = new Fuse(snippetStore.snippetArray, options);

      let ids = fuse.search(searchObject.search).map((e) => {
        return e.item.id;
      });

      return ids.includes(item.id);
    }
  };

  const getSnippets = () => {
    try {
      fetch(`${baseUrl}/api/snippets/getAllSnippets`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data === undefined) {
            console.log("no snippets yet");
          } else {
            let yourSnippets = [];
            for (let i = 0; i < data.length; i++) {
              let decoded = JSON.parse(atob(data[i].code_snippet));
              data[i].code_snippet = decoded;
              if (
                auth.userData.saved !== null &&
                (data[i].user_id === auth.userData.id ||
                  Object.values(auth.userData.saved).includes(data[i].id))
              ) {
                yourSnippets.push(data[i]);
              } else if (data[i].user_id === auth.userData.id) {
                yourSnippets.push(data[i]);
              }
            }

            localStorage.setItem("allSnippetsArray", JSON.stringify(data));
            localStorage.setItem("snippetArray", JSON.stringify(yourSnippets));
            setSnippetStore({
              ...snippetStore,
              allSnippetsArray: JSON.parse(
                localStorage.getItem("allSnippetsArray")
              ),
              snippetArray: JSON.parse(localStorage.getItem("snippetArray")),
              update: !snippetStore.update,
            });
            if (yourSnippets.length > 0) {
              localStorage.setItem(
                "snippetDisplayArray",
                JSON.stringify(yourSnippets[0])
              );
              setSnippetDisplayStore({
                snippetObject: JSON.parse(
                  localStorage.getItem("snippetDisplayArray")
                ),
                update: !snippetDisplayStore.update,
              });
            }
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSnippets();
  }, []);

  return (
    <>
      {snippetStore.snippetArray ? (
        snippetStore.snippetArray.length > 0 ||
        (auth.userData.saved && Object.keys(auth.userData.saved).length > 0) ? (
          <div className={styles.wrapper}>
            {snippetStore.snippetArray.filter(searchFilter).map((e) => {
              return <SnippetShowCase info={e}></SnippetShowCase>;
            })}
          </div>
        ) : (
          <div className={styles.noSnippetsWrap}>
            <Link to="/createsnippet" className={styles.link}>
              Create now
            </Link>
            <p className={styles.links}>or</p>
            <Link to="/searchsnippets" className={styles.link}>
              start browsing
            </Link>
          </div>
        )
      ) : (
        <div className={styles.loadingWrap}>
          <Oval
            height={80}
            width={80}
            color="#07ffc5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#07ffc5"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
    </>
  );
}

export default HomeSnippetDisplay;
