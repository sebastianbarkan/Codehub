import "./App.css";
import { Outlet, useNavigate, ScrollRestoration } from "react-router-dom";

import { AuthWrap } from "./context/AuthWrap";
import { SnippetContext } from "./context/SnippetContext";
import { SearchContext } from "./context/SearchContext";
import { SnippetDisplayContext } from "./context/SnippetDisplayContext";
import { useEffect, useState } from "react";

function App() {
  let navigate = useNavigate();

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
    console.log(isAuthenticated, userData);
    if (isAuthenticated === null || isAuthenticated === false) {
      navigate("/login");
    } else {
      navigate("/home");
    }
  }, []);

  const getSnippets = (id) => {
    try {
      fetch(`http://localhost:8080/snippets/getSnippets?id=${id}`, {
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

  const [search, setSearch] = useState("");

  const [snippetType, setSnippetType] = useState(
    localStorage.getItem("snippetType") === null
      ? "recents"
      : localStorage.getItem("snippetType")
  );

  const [searchObject, setSearchObject] = useState({
    search: search,
    setSearch: setSearch,
  });

  const handleSnippetType = (value) => {
    setSnippetType(value);
  };

  const [auth, setAuth] = useState({
    isAuthenticated: isAuthenticated,
    userData: userData,
  });

  const [snippetStore, setSnippetStore] = useState({
    snippetArray: snippetArray,
    updateSnippetArray: setSnippetArray,
    snippetType: snippetType,
    update: false,
    getSnippets: getSnippets,
    changeSnippetType: setSnippetType,
  });

  const [snippetDisplayStore, setSnippetDisplayStore] = useState({
    snippetObject: snippetDisplayArray,
    snippetViwerObject: snippetViwerObject,
    update: false,
    updateSnippetObject: setSnippetDisplayArray,
  });

  return (
    <AuthWrap.Provider value={{ auth, setAuth }}>
      <SnippetContext.Provider value={{ snippetStore, setSnippetStore }}>
        <SnippetDisplayContext.Provider
          value={{ snippetDisplayStore, setSnippetDisplayStore }}
        >
          <SearchContext.Provider value={{ searchObject, setSearchObject }}>
            <Outlet />
            <ScrollRestoration />
          </SearchContext.Provider>
        </SnippetDisplayContext.Provider>
      </SnippetContext.Provider>
    </AuthWrap.Provider>
  );
}

export default App;
