import baseUrl from "../api/backendfiles";

export default async function UpdateSnippet(snippetId, code) {
  try {
    const updateSnippet = await fetch(`${baseUrl}/snippets/updateSnippet`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([snippetId, code]),
    })
      .then((res) => res.text())
      .then((message) => message);
    return updateSnippet;
  } catch (err) {
    console.log(err);
  }
}
