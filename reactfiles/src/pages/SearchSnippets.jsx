import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { AuthWrap } from "../context/AuthWrap";
import { useNavigate } from "react-router-dom";
import SnippetShowCase from "../components/SnippetShowCase/SnippetShowCase";
import styles from "../styles/pages/SearchSnippet.module.css";
import Fuse from "fuse.js";
import GetAllSnippets from "../utilities/getAllSnippets";
import SnippetSkeleton from "../components/SnippetSkeleton/SnippetSkeleton";
import { SearchContext } from "../context/SearchContext";
import SearchControls from "../components/SearchControls/SearchControls";

function SearchSnippets() {
  const { auth } = useContext(AuthWrap);
  const { query, sortValue, searchLanguage } = useContext(SearchContext);
  const [snippets, setSnippets] = useState();
  const [likesSort, setLikesSort] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate("/login");
    } else if (auth.userData === null) {
      navigate("/login");
    }
  }, [auth.isAuthenticated, auth.userData]);

  const getAllSnippets = async () => {
    try {
      //fetch all snippets
      const allSnippets = await GetAllSnippets(auth.userData.id);
      //make sure that the snippets arent undefined
      if (allSnippets === undefined) {
        console.log("no snippets yet");
      } else {
        setSnippets(allSnippets);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllSnippets();
  }, []);

  const searchFilter = (item, i) => {
    if (query === "") {
      return item;
    } else {
      const options = {
        includeScore: true,
        useExtendedSearch: true,
        threshold: 0.5,
        keys: ["title"],
      };

      const fuse = new Fuse(snippets, options);

      let ids = fuse.search(query).map((e) => {
        return e.item.id;
      });
      return ids.includes(item.id);
    }
  };

  const categorySort = (a, b) => {
    if (sortValue === "Recents") {
      return b.created_at - a.created_at;
    } else if (sortValue === "Likes") {
      return b.likes - a.likes;
    }
  };

  const languageFilter = (item, i) => {
    if (searchLanguage === "All languages") {
      return item;
    } else if (searchLanguage === item.language) {
      return item;
    }
  };

  //skeleton array for placeholder loading
  const skeleton = Array.apply(null, Array(20)).map(function () {});

  return (
    <>
      <div className={styles.wrapper}>
        <Sidebar></Sidebar>
        <div className={styles.contentWrap}>
          <Header></Header>
          <div className={styles.mainContent}>
            <SearchControls />
            <div className={styles["results-wrap"]}>
              {snippets ? (
                snippets
                  .filter(searchFilter)
                  .filter(languageFilter)
                  .sort(categorySort)
                  .map((e, i) => {
                    return (
                      <SnippetShowCase
                        info={e}
                        likeSort={likesSort}
                      ></SnippetShowCase>
                    );
                  })
              ) : (
                <>
                  {skeleton.map(() => {
                    return <SnippetSkeleton />;
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchSnippets;
