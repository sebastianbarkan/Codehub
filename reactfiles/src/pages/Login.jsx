import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthWrap } from "../context/AuthWrap";
import { SnippetContext } from "../context/SnippetContext";
import { SnippetDisplayContext } from "../context/SnippetDisplayContext";
import styles from "../styles/pages/Login.module.css";
import baseUrl from "../api/backendfiles";
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
  console.log("test", baseUrl);
  let navigate = useNavigate();
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
    try {
      const isAuthenticated = await fetch(
        `${baseUrl}/login?username=${username}&password=${password}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      ).then((res) => res.text());

      if (isAuthenticated === "success") {
        getUser();
      } else if (isAuthenticated === "Unauthorized") {
        setUnauthorized(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getUser = () => {
    try {
      fetch(`${baseUrl}/user`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data) {
            if (data.liked !== null) {
              let decoded = JSON.parse(atob(data.liked));
              data.liked = decoded;
            }

            if (data.saved !== null) {
              let decoded = JSON.parse(atob(data.saved));
              data.saved = decoded;
            }

            localStorage.setItem("userData", JSON.stringify(data));
            localStorage.setItem("isLoggedIn", JSON.stringify(true));
            setAuth({
              ...auth,
              isAuthenticated: true,
              userData: data,
            });
            console.log(localStorage.getItem("isLoggedIn"));
          } else {
            console.log("no user");
          }
          return data;
        })
        .then((res) => getSnippets(res));
    } catch (err) {
      console.log(err);
    }
  };

  const getSnippets = (userInfo) => {
    try {
      fetch(`${baseUrl}/snippets/getAllSnippets`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data === undefined || data.length < 1) {
            console.log("no snippets yet");
          } else {
            let yourSnippets = [];
            console.log(data, "DATA");
            for (let i = 0; i < data.length; i++) {
              let decoded = JSON.parse(atob(data[i].code_snippet));
              data[i].code_snippet = decoded;

              if (
                userInfo.saved !== null &&
                (data[i].user_id === userInfo.id ||
                  Object.values(userInfo.saved).includes(data[i].id))
              ) {
                yourSnippets.push(data[i]);
              } else if (data[i].user_id === userInfo.id) {
                yourSnippets.push(data[i]);
              }
            }

            localStorage.setItem("snippetArray", JSON.stringify(yourSnippets));
            localStorage.setItem("allSnippetsArray", JSON.stringify(data));
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
