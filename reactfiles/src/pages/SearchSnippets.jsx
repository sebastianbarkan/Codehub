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
  const { query } = useContext(SearchContext);
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

  const [sortValue, setSortValue] = useState("Latest");
  const [languageValue, setLanguageValue] = useState({
    value: "All languages",
    label: "All languages",
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
    if (languageValue.value === "All languages") {
      return item;
    } else {
      return item.language === languageValue.value;
    }
  };

  const options = [
    { value: "Latest", label: "Latest" },
    { value: "Likes", label: "Likes" },
  ];

  const languageOptions = [
    { value: "All languages", label: "All languages" },
    { value: "react-ts", label: "react/typescript" },
    { value: "react", label: "react" },
    { value: "angular", label: "angular" },
    { value: "vue", label: "vue" },
    { value: "vue3", label: "vue3" },
    { value: "vanilla-ts", label: "typescript" },
    { value: "vanilla", label: "vanilla js" },
  ];

  //custom styles for react-select
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
      width: "200px",
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

  const handleSearchSort = (choice) => {
    if (choice === "Latest") {
      //sort by date created
      let latestSort = snippets.sort((a, b) => {
        let aTime = new Date(a.created_at).getTime();
        let bTime = new Date(b.created_at).getTime();
        return bTime - aTime;
      });
      setSnippets(latestSort);
      setSortValue(choice);
    } else if (choice === "Likes") {
      //sort by the amount of likes
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
              ) : (
                <>
                  {skeleton.map((e, i) => {
                    console.log(e, "JERE");
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
