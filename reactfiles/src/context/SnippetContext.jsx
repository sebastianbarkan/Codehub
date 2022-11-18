import { createContext } from "react";

export const SnippetContext = createContext({
  globalSnippetArray: [],
  snippetArray: [],
  snippetType: "recents",
  changeSnippetType: () => {},
});
