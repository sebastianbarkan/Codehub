import baseUrl from "../api/backendfiles";
import { useContext } from "react";
import { AuthWrap } from "../context/AuthWrap";
import { SnippetContext } from "../context/SnippetContext";
import { SnippetDisplayContext } from "../context/SnippetDisplayContext";

export default async function GetSnippets() {
  //import all context stores

  try {
    const snippets = await fetch(`${baseUrl}/snippets/getAllSnippets`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
    return snippets;
  } catch (err) {
    console.log(err);
  }
}
