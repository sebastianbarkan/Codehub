import baseUrl from "../api/backendfiles";

export default async function CreateSnippet(snippetObject, code) {
  try {
    const snippetCreated = await fetch(`${baseUrl}/snippets/create`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([snippetObject, code]),
    }).then((res) => {
      return res.status;
    });
    return snippetCreated;
  } catch (err) {
    console.log(err);
  }
}
