import React, { useState, useContext } from "react";
import styles from "../CreateSnippetDetails/CreateSnippetDetails.module.css";
import Select from "react-select";
import CreateSnippet from "../../utilities/createSnippet";
import { AuthWrap } from "../../context/AuthWrap";

function CreateSnippetDetails() {
  const options = [
    {
      value: "react-ts",
      label: "react/typescript",
      setup: {
        files: {},
      },
    },
    { value: "react", label: "react", setup: {} },
    { value: "angular", label: "angular", setup: {} },
    { value: "vue", label: "vue", setup: {} },
    { value: "vue3", label: "vue3", setup: {} },
    { value: "vanilla-ts", label: "typescript", setup: {} },
    {
      value: "vanilla",
      label: "vanilla js",
      setup: {},
    },
  ];

  //custom styles for react select
  const customStyles = {
    option: (provided) => ({
      ...provided,
      padding: 20,
      cursor: "pointer",
      backgroundColor: "#505050",
      borderBottom: "1px solid white",
    }),
    control: () => ({
      cursor: "pointer",
      display: "flex",
      color: "white",
      backgroundColor: "#505050",
      width: "100%",
      borderRadius: "4px",
    }),
    menu: (provided, state) => ({
      ...provided,
      color: "white",
      backgroundColor: "#505050",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: "white",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      opacity: state.isDisabled ? "0.5" : "1",
      transition: "opacity 300ms",
      "&:hover": {
        backgroundColor: "none",
      },
      color: "white",
    }),
    container: (provided, state) => ({
      ...provided,
      width: "100%",
      color: "white",
    }),
    input: (provided, state) => ({
      ...provided,
      color: "white",
    }),
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.sidebarLabel}>Snippet Info</p>
    </div>
  );
}

export default CreateSnippetDetails;
