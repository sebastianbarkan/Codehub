import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthWrap } from "../context/AuthWrap";
import { SnippetContext } from "../context/SnippetContext";
import { SnippetDisplayContext } from "../context/SnippetDisplayContext";
import styles from "../styles/pages/Login.module.css";
import baseUrl from "../api/backendfiles";
import GetUser from "../utilities/getUser";
import GetAuthentication from "../utilities/getAuthentication";
import GetSnippets from "../utilities/getSnippets";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const [hasSnippets, setHasSnippets] = useState(false);
  const { auth, setAuth } = useContext(AuthWrap);
  const { snippetDisplayStore, setSnippetDisplayStore } = useContext(
    SnippetDisplayContext
  );
  const { snippetStore, setSnippetStore } = useContext(SnippetContext);

  let navigate = useNavigate();

  //direct to home if authentication is correct
  useEffect(() => {
    if (hasSnippets) {
      if (snippetStore.update === true && auth.isAuthenticated === true) {
        navigate("/home");
      }
    } else if (auth.isAuthenticated === true) {
      navigate("/home");
    }
  }, [snippetStore.update, auth.isAuthenticated]);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isAuthenticated = await GetAuthentication(username, password);

    //check if authentication was success before fetching data
    if (isAuthenticated === "success") {
      //fetch the user data
      const userData = await GetUser();
      if (userData) {
        //check if liked object is null before decoding and saving it
        if (userData.liked !== null) {
          let decoded = JSON.parse(atob(userData.liked));
          userData.liked = decoded;
        }
        //check if saved object is null before decoding and saving it
        if (userData.saved !== null) {
          let decoded = JSON.parse(atob(userData.saved));
          userData.saved = decoded;
        }
        //set updated user data in localstorage and save to context
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        setAuth({
          ...auth,
          isAuthenticated: true,
          userData: userData,
        });
        //fetch snippets
        const snippets = await GetSnippets();
        //check if snippets are undefined
        if (snippets === undefined || snippets.length < 1) {
          console.log("no snippets yet");
        } else {
          //if there are snippets loop through them all and decode them
          let yourSnippets = [];
          for (let i = 0; i < snippets.length; i++) {
            let decoded = JSON.parse(atob(snippets[i].code_snippet));
            snippets[i].code_snippet = decoded;

            if (
              auth.userData.saved !== null &&
              (snippets[i].user_id === auth.userData.id ||
                Object.values(auth.userData.saved).includes(snippets[i].id))
            ) {
              yourSnippets.push(snippets[i]);
            } else if (snippets[i].user_id === auth.userData.id) {
              yourSnippets.push(snippets[i]);
            }
          }
          //save the snippets to global context store and localstorage
          localStorage.setItem("snippetArray", JSON.stringify(yourSnippets));
          localStorage.setItem("allSnippetsArray", JSON.stringify(snippets));
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
      } else {
        console.log("no user");
      }
    } else {
      setUnauthorized(true);
    }
  };

  return (
    <>
      <section className={styles.wrapper}>
        <form className={styles.form}>
          <h1 className={styles.header}>
            Login To Your Account
            <span className={styles["period-span"]}>.</span>
          </h1>
          {unauthorized ? (
            <p className={styles.warning}>Email or Password is incorrect.</p>
          ) : null}
          <input
            name="username"
            id="username"
            value={username}
            onChange={handleUsername}
            placeholder="Username"
            className={styles.input}
          ></input>
          <input
            name="password"
            id="password"
            value={password}
            onChange={handlePassword}
            type="password"
            placeholder="Password"
            className={styles.input}
          ></input>
          <button
            type="button"
            onClick={handleSubmit}
            className={styles.submit}
          >
            SIGN IN
          </button>
          <div className={styles["bottom-links"]}>
            <Link to="/signup" className={styles["signup-link-wrap"]}>
              Create an account.
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;
