import baseUrl from "../api/backendfiles";

export default async function LikeSnippet(snippetId, likedObject, userId) {
  try {
    const likeSnippet = await fetch(`${baseUrl}/snippets/likeSnippet`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ id: snippetId }, likedObject, userId]),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("LIKE", data);
        return data;
      });
    return likeSnippet;
  } catch (err) {
    console.log(err);
  }
}
