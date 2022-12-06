import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { AuthWrap } from "../context/AuthWrap";
import { useNavigate } from "react-router-dom";
import SnippetShowCase from "../components/SnippetShowCase/SnippetShowCase";
import styles from "../styles/pages/SearchSnippet.module.css";
import Fuse from "fuse.js";
import Select from "react-select";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import baseUrl from "../api/backendfiles";

function SearchSnippets() {
  const [query, setQuery] = useState("");
  const { auth } = useContext(AuthWrap);
  const [showFilters, setShowFilters] = useState(false);
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

  const getAllSnippets = () => {
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
          for (let i = 0; i < data.length; i++) {
            let decoded = JSON.parse(atob(data[i].code_snippet));
            data[i].code_snippet = decoded;
          }
          if (data === undefined) {
            console.log("no snippets yet");
          } else {
            let privateSnippet = [];
            data.forEach((snippet, i) => {
              if (snippet.public === 1) {
                privateSnippet.push(snippet);
              }
              if (i === data.length - 1) {
                let sorted = data.sort((a, b) => {
                  let aTime = new Date(a.created_at).getTime();
                  let bTime = new Date(b.created_at).getTime();
                  return bTime - aTime;
                });
                console.log("sorted");
                setSnippets(sorted);
              }
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllSnippets();
  }, []);

  const [sortValue, setSortValue] = useState("Latest");
  const [languageValue, setLanguageValue] = useState({
    value: "All",
    label: "All",
  });

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

  const languageFilter = (item, i) => {
    if (languageValue.value === "All") {
      return item;
    } else {
      return item.language === languageValue.value;
    }
  };

  const handleSearchQuery = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const options = [
    { value: "Latest", label: "Latest" },
    { value: "Likes", label: "Likes" },
  ];

  const languageOptions = [
    { value: "All", label: "All" },
    { value: "react-ts", label: "react/typescript" },
    { value: "react", label: "react" },
    { value: "angular", label: "angular" },
    { value: "vue", label: "vue" },
    { value: "vue3", label: "vue3" },
    { value: "vanilla-ts", label: "typescript" },
    { value: "vanilla", label: "vanilla js" },
  ];

  const customStyles = {
    option: (provided) => ({
      ...provided,
      padding: 20,
      cursor: "pointer",
      fontSize: "1.2rem",
    }),
    control: () => ({
      cursor: "pointer",
      display: "flex",
      color: "white",
      border: "1px solid rgb(255, 255, 255, .3)",
      backgroundColor: "none",
      width: "150px",
      fontSize: "1.2rem",
      borderRadius: "4px",
    }),
    menu: (provided, state) => ({
      ...provided,
      color: "black",
      zIndex: 99,
      width: "100%",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: "white",
      fontSize: "1.2rem",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      opacity: state.isDisabled ? "0.5" : "1",
      transition: "opacity 300ms",
      color: "white",
    }),
    container: (provided, state) => ({
      ...provided,
      color: "white",
    }),
    input: (provided, state) => ({
      ...provided,
      color: "white",
    }),
  };

  const searchSort = (choice) => {
    if (choice.value === "Latest") {
      let latestSort = snippets.sort((a, b) => {
        let aTime = new Date(a.created_at).getTime();
        let bTime = new Date(b.created_at).getTime();
        return bTime - aTime;
      });
      setSnippets(latestSort);
      setSortValue(choice);
    } else if (choice.value === "Likes") {
      let likeSort = snippets.sort((a, b) => {
        return b.likes - a.likes;
      });
      setSnippets(likeSort);
      setSortValue(choice);
      setLikesSort(!likesSort);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <Sidebar></Sidebar>
        <div className={styles.contentWrap}>
          <Header></Header>
          <div className={styles.searchContent}>
            <div className={styles.searchWrap}>
              <div className={styles.searchContainer}>
                <div className={styles.mainSearchWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    value={query}
                    onChange={handleSearchQuery}
                    placeholder="Search..."
                  ></input>
                </div>

                <div className={styles.filtersWrap}>
                  <div className={styles.filterItem}>
                    <p className={styles.filterLabel}>Sort By</p>
                    <Select
                      id="reactselect"
                      styles={customStyles}
                      className={styles["filter-select"]}
                      placeholder={sortValue}
                      options={options}
                      isSearchable={false}
                      onChange={(choice) => searchSort(choice)}
                      value={sortValue}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                    />
                  </div>
                  <div className={styles.filterItem}>
                    <p className={styles.filterLabel}>Framework</p>
                    <Select
                      id="reactselect"
                      styles={customStyles}
                      className={styles["filter-select"]}
                      placeholder={languageValue.value}
                      options={languageOptions}
                      isSearchable={false}
                      onChange={(choice) => setLanguageValue(choice)}
                      value={languageValue.value}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                    />
                  </div>
                </div>
                {showFilters ? (
                  <div className={styles.filtersWrapMobile}>
                    <div className={styles.filterItem}>
                      <p className={styles.filterLabel}>Sort By</p>
                      <Select
                        id="reactselect"
                        styles={customStyles}
                        className={styles["filter-select"]}
                        placeholder={sortValue}
                        options={options}
                        isSearchable={false}
                        onChange={(choice) => setSortValue(choice)}
                        value={sortValue}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                      />
                    </div>
                    <div className={styles.filterItem}>
                      <p className={styles.filterLabel}>Framework</p>
                      <Select
                        id="reactselect"
                        styles={customStyles}
                        className={styles["filter-select"]}
                        placeholder={languageValue.value}
                        options={languageOptions}
                        isSearchable={false}
                        onChange={(choice) => setLanguageValue(choice)}
                        value={languageValue.value}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                      />
                    </div>
                    <div className={styles.filterToggleWrap}>
                      <p
                        className={styles.filterButtonMobile}
                        onClick={toggleFilters}
                      >
                        close
                      </p>
                      <FaArrowUp
                        className={styles.toggleFilterIcon}
                        onClick={toggleFilters}
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.filterToggleWrap}>
                    <p
                      className={styles.filterButtonMobile}
                      onClick={toggleFilters}
                    >
                      filters
                    </p>
                    <FaArrowDown
                      className={styles.toggleFilterIcon}
                      onClick={toggleFilters}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={styles["results-wrap"]}>
              {snippets
                ? snippets
                    .filter(searchFilter)
                    .filter(languageFilter)
                    .map((e, i) => {
                      return (
                        <>
                          <SnippetShowCase
                            info={e}
                            likeSort={likesSort}
                          ></SnippetShowCase>
                        </>
                      );
                    })
                : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchSnippets;
