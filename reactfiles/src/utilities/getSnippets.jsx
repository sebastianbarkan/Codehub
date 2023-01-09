import baseUrl from "../api/backendfiles";

export default async function GetSnippets() {
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
