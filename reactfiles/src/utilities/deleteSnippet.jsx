import baseUrl from "../api/backendfiles";

export default async function DeleteSnippet(snippetId) {
  try {
    const snippetDeleted = await fetch(`${baseUrl}/snippets/deleteSnippet`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: snippetId,
      }),
    }).then((res) => {
      return res;
    });
    return snippetDeleted;
  } catch (err) {
    console.log(err);
  }
}
