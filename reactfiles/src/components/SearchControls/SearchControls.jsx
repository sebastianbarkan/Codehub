import React, { useContext, useState } from "react";
import styles from "./SearchControls.module.css";
import {
  BackspaceIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";

import { SearchContext } from "../../context/SearchContext";

function SearchControls() {
  const {
    setSortValue,
    sortValue,
    searchLanguage,
    setSearchLanguage,
    query,
    setQuery,
  } = useContext(SearchContext);
  const [showLanguages, setShowLanguages] = useState(false);

  const handleLanguageFilter = (e) => {
    setSearchLanguage(e.target.value);
    setShowLanguages(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.filterSearch}>
        <input
          className={styles.input}
          type="text"
          placeholder="Filter..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <BackspaceIcon
          className={styles.clearIcon}
          onClick={() => setQuery("")}
        />
      </div>
      <div className={styles.filterToggles}>
        <button
          className={
            sortValue === "Recents"
              ? styles.filterToggleSelected
              : styles.filterToggle
          }
          value={"Recents"}
          onClick={(e) => {
            setSortValue(e.target.value);
          }}
        >
          Recents
        </button>
        <button
          className={
            sortValue === "Likes"
              ? styles.filterToggleSelected
              : styles.filterToggle
          }
          value={"Likes"}
          onClick={(e) => {
            setSortValue(e.target.value);
          }}
        >
          Most Liked
        </button>

        <div className={styles.languageWrap}>
          {showLanguages ? (
            <div
              className={styles.languageDropDown}
              onClick={() => setShowLanguages(false)}
            >
              <label className={styles.languageLabel} value={searchLanguage}>
                {searchLanguage}
              </label>
              <ChevronUpIcon className={styles.chevronIcon} />
            </div>
          ) : (
            <div
              className={styles.languageDropDown}
              onClick={() => setShowLanguages(true)}
            >
              <label className={styles.languageLabel} value={searchLanguage}>
                {searchLanguage}
              </label>
              <ChevronDownIcon className={styles.chevronIcon} />
            </div>
          )}

          {showLanguages ? (
            <div className={styles.languageResultsWrap}>
              <div className={styles.languageResults}>
                <option
                  className={styles.languageResult}
                  value="All languages"
                  onClick={(e) => handleLanguageFilter(e)}
                >
                  All languages
                </option>
                <option
                  className={styles.languageResult}
                  value="vanilla"
                  onClick={(e) => handleLanguageFilter(e)}
                >
                  vanilla
                </option>
                <option
                  className={styles.languageResult}
                  value="vanilla-ts"
                  onClick={(e) => handleLanguageFilter(e)}
                >
                  vanilla/ts
                </option>
                <option
                  className={styles.languageResult}
                  value="react"
                  onClick={(e) => handleLanguageFilter(e)}
                >
                  react
                </option>
                <option
                  className={styles.languageResult}
                  value="react-ts"
                  onClick={(e) => handleLanguageFilter(e)}
                >
                  react/ts
                </option>
                <option
                  className={styles.languageResult}
                  value="vue"
                  onClick={(e) => handleLanguageFilter(e)}
                >
                  vue
                </option>
                <option
                  className={styles.languageResult}
                  value="vue3"
                  onClick={(e) => handleLanguageFilter(e)}
                >
                  vue3
                </option>
                <option
                  className={styles.languageResult}
                  value="angular"
                  onClick={(e) => handleLanguageFilter(e)}
                >
                  angular
                </option>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SearchControls;
