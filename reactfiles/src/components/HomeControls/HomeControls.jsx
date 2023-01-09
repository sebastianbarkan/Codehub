import React, { useContext, useState } from "react";
import styles from "./HomeControls.module.css";
import {
  BackspaceIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";

import { SearchContext } from "../../context/SearchContext";

function HomeControls() {
  const {
    setHomeSortValue,
    homeSortValue,
    language,
    setLanguage,
    homeQuery,
    setHomeQuery,
  } = useContext(SearchContext);
  const [showLanguages, setShowLanguages] = useState(false);

  const handleLanguageFilter = (e) => {
    setLanguage(e.target.value);
    setShowLanguages(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.filterSearch}>
        <input
          className={styles.input}
          type="text"
          placeholder="Filter..."
          value={homeQuery}
          onChange={(e) => setHomeQuery(e.target.value)}
        />
        <BackspaceIcon
          className={styles.clearIcon}
          onClick={(e) => setHomeQuery("")}
        />
      </div>
      <div className={styles.filterToggles}>
        <button
          className={
            homeSortValue === "Recents"
              ? styles.filterToggleSelected
              : styles.filterToggle
          }
          value={"Recents"}
          onClick={(e) => {
            setHomeSortValue(e.target.value);
          }}
        >
          Recents
        </button>
        <button
          className={
            homeSortValue === "Likes"
              ? styles.filterToggleSelected
              : styles.filterToggle
          }
          value={"Likes"}
          onClick={(e) => {
            setHomeSortValue(e.target.value);
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
              <label className={styles.languageLabel} value={language}>
                {language}
              </label>
              <ChevronUpIcon className={styles.chevronIcon} />
            </div>
          ) : (
            <div
              className={styles.languageDropDown}
              onClick={() => setShowLanguages(true)}
            >
              <label className={styles.languageLabel} value={language}>
                {language}
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

export default HomeControls;
