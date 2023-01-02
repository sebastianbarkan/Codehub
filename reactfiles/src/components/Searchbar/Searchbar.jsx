import React, { useState, useEffect, useContext } from "react";
import GetAllSnippets from "../../utilities/getAllSnippets";
import { AuthWrap } from "../../context/AuthWrap";
import { SnippetDisplayContext } from "../../context/SnippetDisplayContext";
import Fuse from "fuse.js";
import styles from "../Searchbar/Searchbar.module.css";
import { FaSearch, FaTimesCircle } from "react-icons/fa";
import Avatar from "boring-avatars";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";

function Searchbar() {
  const [snippets, setSnippets] = useState([{ id: "noresults" }]);
  const [currentQuery, setCurrentQuery] = useState("");
  const { auth } = useContext(AuthWrap);
  const { snippetDisplayStore, setSnippetDisplayStore } = useContext(
    SnippetDisplayContext
  );
  const { setQuery } = useContext(SearchContext);
  let navigate = useNavigate();
  let location = useLocation();

  const handleSearchQuery = (e) => {
    e.preventDefault();
    setCurrentQuery(e.target.value);
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      console.log("e");
      setQuery(currentQuery);

      navigate("/searchsnippets");
    }
  };

  const searchFilter = (item, i) => {
    if (currentQuery === "") {
      return item;
    } else {
      const options = {
        includeScore: true,
        useExtendedSearch: true,
        threshold: 0.5,
        keys: ["title"],
      };

      const fuse = new Fuse(snippets, options);

      let ids = fuse.search(currentQuery).map((e) => {
        return e.item.id;
      });

      if (ids.length === 0) {
        return item.id === "noresults";
      }

      return ids.includes(item.id);
    }
  };

  const getAllSnippets = async () => {
    try {
      //fetch all snippets
      const allSnippets = await GetAllSnippets(auth.userData.id);
      //make sure that the snippets arent undefined
      if (allSnippets === undefined) {
        console.log("no snippets yet");
      } else {
        allSnippets.push({ id: "noresults" });
        setSnippets(allSnippets);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllSnippets();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBarContainer}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          className={styles.input}
          value={currentQuery}
          onChange={handleSearchQuery}
          placeholder="Search..."
          onKeyDown={handleSearchEnter}
        ></input>
        <FaTimesCircle
          className={currentQuery !== "" ? styles.cancelIcon : styles.hidden}
          onClick={() => setCurrentQuery("")}
        />
      </div>

      <div className={styles.searchResultsWrapper}>
        <div
          className={
            currentQuery === "" ? styles.hidden : styles.searchResultsContainer
          }
        >
          {snippets && currentQuery !== ""
            ? snippets.filter(searchFilter).map((e, i) => {
                return (
                  <>
                    {e.id === "noresults" ? (
                      <div className={styles.noResultsItem}>
                        <p className={styles.noResults}>No results</p>
                      </div>
                    ) : (
                      <div
                        className={styles.resultItem}
                        onClick={() => {
                          if (location.pathname !== "/home") {
                            setSnippetDisplayStore({
                              ...snippetDisplayStore,
                              snippetViewerObject: e,
                            });
                            setCurrentQuery("");
                            navigate(`/viewsnippet/${e.title}`);
                          } else {
                            localStorage.setItem(
                              "snippetDisplayArray",
                              JSON.stringify(e)
                            );
                            setCurrentQuery("");
                            setSnippetDisplayStore({
                              ...snippetDisplayStore,
                              snippetObject: JSON.parse(
                                localStorage.getItem("snippetDisplayArray")
                              ),
                            });
                          }
                        }}
                      >
                        <Avatar
                          size={30}
                          name={`${e.user_id}`}
                          variant="beam"
                          className={styles.avatar}
                          square={true}
                        />
                        <h1 className={styles.title}>{e.title}</h1>
                        <p className={styles.author}>{e.author}</p>
                      </div>
                    )}
                  </>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}

export default Searchbar;
