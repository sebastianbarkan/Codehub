import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/pages/SignUp.module.css";
import baseUrl from "../api/backendfiles";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  let navigate = useNavigate();
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    try {
      fetch(`${baseUrl}/register`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message.mess === "email in use") {
            setEmailTaken(true);
          } else if (data.message.mess === "username taken") {
            setUsernameTaken(true);
          } else if (data.success) {
            navigate("/login");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.form}>
          <h1 className={styles.header}>
            Create An Account<span className={styles["period-span"]}>.</span>
            <span className={styles.hidden}>sign</span>
          </h1>
          {usernameTaken ? (
            <p className={styles.warning}>Sorry, this username is taken.</p>
          ) : null}
          <input
            name="username"
            id="username"
            onChange={handleUsername}
            value={username}
            placeholder="Username"
            className={styles.input}
          ></input>

          <input
            name="password"
            id="password"
            onChange={handlePassword}
            value={password}
            placeholder="Password"
            type="password"
            className={styles.input}
          ></input>
          {emailTaken ? (
            <p className={styles.warning}>This email is in use.</p>
          ) : null}
          <input
            name="email"
            id="email"
            onChange={handleEmail}
            value={email}
            placeholder="Email"
            className={styles.input}
          ></input>

          <button
            type="button"
            onClick={handleSubmit}
            className={styles.submit}
          >
            SIGN UP
          </button>
          <div className={styles["bottom-links"]}>
            <p className="placeholder">Already have an account?</p>
            <Link to="/login" className={styles["login-link-wrap"]}>
              Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignUp;
