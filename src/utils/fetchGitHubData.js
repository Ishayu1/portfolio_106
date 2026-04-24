import { fetchJSON } from "./fetchJSON";

export async function fetchGitHubData(username) {
  return await fetchJSON(`https://api.github.com/users/${username}`);
}

