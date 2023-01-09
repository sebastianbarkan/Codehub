import { createContext } from "react";

export const SearchContext = createContext({
  query: "",
  setQuery: () => {},
  homeQuery: "",
  setHomeQuery: () => {},
  sortValue: "Recents",
  setSortValue: () => {},
  homeSortValue: "",
  setHomeSortValue: () => {},
  language: "",
  setLanguage: () => {},
  searchLanguage: "",
  setSearchLanguage: () => {},
});
