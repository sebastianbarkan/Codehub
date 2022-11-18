import React, { useContext, useState } from "react";
import styles from "./UserSnippetSearch.module.css";
import { SearchContext } from "../../context/SearchContext";

function UserSnippetsSearch() {
  const { setSearchObject } = useContext(SearchContext);
  const [query, setQuery] = useState("");

  const handleQueryChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
    setSearchObject({
      search: e.target.value,
    });
  };

  return (
    <>
      <section className={styles.wrapper}>
        <input
          type="search"
          className={styles["search-input"]}
          placeholder="Search your snippets..."
          onChange={handleQueryChange}
          value={query}
        />
      </section>
    </>
  );
}

export default UserSnippetsSearch;
