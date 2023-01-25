import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthWrap } from "./context/AuthWrap";
import { SnippetContext } from "./context/SnippetContext";
import { SearchContext } from "./context/SearchContext";
import { SnippetDisplayContext } from "./context/SnippetDisplayContext";
import { useEffect, useState } from "react";
import baseUrl from "./api/backendfiles";

function App() {
  let navigate = useNavigate();

  //initialize all context values
  const [userData, setUserData] = useState(
    localStorage.getItem("userData") === null
      ? null
      : JSON.parse(localStorage.getItem("userData"))
  );

  const [snippetArray, setSnippetArray] = useState(
    localStorage.getItem("snippetArray") === null
      ? null
      : JSON.parse(localStorage.getItem("snippetArray"))
  );

  const [snippetDisplayArray, setSnippetDisplayArray] = useState();
  let snippetViwerObject = {};

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isLoggedIn") === null
      ? null
      : JSON.parse(localStorage.getItem("isLoggedIn"))
  );

  useEffect(() => {
    if (isAuthenticated === null || isAuthenticated === false) {
      navigate("/login");
    } else {
      navigate("/home");
    }
  }, []);

  const [snippetType, setSnippetType] = useState(
    localStorage.getItem("snippetType") === null
      ? "recents"
      : localStorage.getItem("snippetType")
  );
  const [query, setQuery] = useState("");
  const [homeQuery, setHomeQuery] = useState("");
  const [sortValue, setSortValue] = useState("Recents");
  const [homeSortValue, setHomeSortValue] = useState("Recents");
  const [language, setLanguage] = useState("All languages");
  const [searchLanguage, setSearchLanguage] = useState("All languages");
  const [auth, setAuth] = useState({
    isAuthenticated: isAuthenticated,
    userData: userData,
  });

  const [snippetDisplayStore, setSnippetDisplayStore] = useState({
    snippetObject: snippetDisplayArray,
    snippetViwerObject: snippetViwerObject,
    update: false,
    updateSnippetObject: setSnippetDisplayArray,
  });

  //Retrieve all snippets data
  const getSnippets = (id) => {
    try {
      fetch(`${baseUrl}/api/snippets/getSnippets?id=${id}`, {
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

  const [snippetStore, setSnippetStore] = useState({
    snippetArray: snippetArray,
    updateSnippetArray: setSnippetArray,
    snippetType: snippetType,
    update: false,
    getSnippets: getSnippets,
    changeSnippetType: setSnippetType,
  });

  return (
    <AuthWrap.Provider value={{ auth, setAuth }}>
      <SnippetContext.Provider value={{ snippetStore, setSnippetStore }}>
        <SnippetDisplayContext.Provider
          value={{ snippetDisplayStore, setSnippetDisplayStore }}
        >
          <SearchContext.Provider
            value={{
              query,
              setQuery,
              homeQuery,
              setHomeQuery,
              sortValue,
              setSortValue,
              homeSortValue,
              setHomeSortValue,
              language,
              setLanguage,
              searchLanguage,
              setSearchLanguage,
            }}
          >
            <Outlet />
          </SearchContext.Provider>
        </SnippetDisplayContext.Provider>
      </SnippetContext.Provider>
    </AuthWrap.Provider>
  );
}

export default App;
