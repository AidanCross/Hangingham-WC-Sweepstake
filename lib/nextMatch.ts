export function getNextMatch(team: string, matches: any[]) {
  const upcoming = matches
    .filter((m) =>
      ["TIMED", "SCHEDULED", "POSTPONED"].includes(m.status)
    )
    .filter(
      (m) =>
        m.homeTeam?.name === team ||
        m.awayTeam?.name === team
    )
    .sort(
      (a, b) =>
        new Date(a.utcDate).getTime() -
        new Date(b.utcDate).getTime()
    );

  const match = upcoming[0];
  if (!match) return null;

  return {
    matchText: `${match.homeTeam?.name} vs ${match.awayTeam?.name}`,
    kickoff: match.utcDate,
  };
}