import baseUrl from "../api/backendfiles";

export default async function GetUser() {
  try {
    const userData = await fetch(`${baseUrl}/user`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });

    return userData;
  } catch (err) {
    console.log(err);
  }
}
