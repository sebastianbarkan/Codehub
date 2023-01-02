import baseUrl from "../api/backendfiles";

export default async function RemoveFromSaved(userId, savedObject) {
  try {
    const removeFromSaved = await fetch(`${baseUrl}/snippets/removeFromSaved`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([userId, savedObject]),
    })
      .then((res) => res.json())
      .then((data) => data);
    return removeFromSaved;
  } catch (err) {
    console.log(err);
  }
}
