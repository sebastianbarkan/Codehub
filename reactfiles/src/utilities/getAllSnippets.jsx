import baseUrl from "../api/backendfiles";

export default async function GetAllSnippets(userId) {
  try {
    const allSnippets = await fetch(
      `${baseUrl}/snippets/getAllSnippets?userId=${userId}`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        //decode the snippets
        for (let i = 0; i < data.length; i++) {
          let decoded = JSON.parse(atob(data[i].code_snippet));
          data[i].code_snippet = decoded;
        }

        //sort by date created to show latest ones by default
        let sorted = data.sort((a, b) => {
          let aTime = new Date(a.created_at).getTime();
          let bTime = new Date(b.created_at).getTime();
          return bTime - aTime;
        });
        return sorted;
      });
    return allSnippets;
  } catch (err) {
    console.log(err);
  }
}
