import baseUrl from "../api/backendfiles";

export default async function UpdateSnippet(snippetId, code, title) {
  try {
    const updateSnippet = await fetch(`${baseUrl}/snippets/updateSnippet`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([snippetId, code, title]),
    })
      .then((res) => res.json())
      .then((data) => data);
    return updateSnippet;
  } catch (err) {
    console.log(err);
  }
}
