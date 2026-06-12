const BASE_URL = "https://api.football-data.org/v4";

export async function fetchMatches() {
  const res = await fetch(
    `${BASE_URL}/competitions/WC/matches`, // swap PL -> WC when needed
    {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_API_KEY!,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch matches");

  const data = await res.json();
  return data.matches;
}