import baseUrl from "../api/backendfiles";

export default async function GetAuthentication(username, password) {
  try {
    const isAuthenticated = await fetch(`${baseUrl}/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((res) => res.text());
    return isAuthenticated;
  } catch (err) {
    console.log(err);
  }
}
