import baseUrl from "../api/backendfiles";

export default async function SaveSnippet(savedObject, userId) {
  try {
    const savedSnipept = await fetch(`${baseUrl}/snippets/saveSnippet`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([savedObject, userId]),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return data;
      });
    return savedSnipept;
  } catch (err) {
    console.log(err);
  }
}
