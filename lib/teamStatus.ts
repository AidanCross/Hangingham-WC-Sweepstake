export function getTeamStatus(team: string, matches: any[]) {
  let eliminated = false;

  for (const m of matches) {
    const home = m.homeTeam?.name;
    const away = m.awayTeam?.name;

    const winner = m.score?.winner;

    // only knockout matches matter for elimination logic
    const isKnockout =
      m.stage === "LAST_16" ||
      m.stage === "QUARTER_FINALS" ||
      m.stage === "SEMI_FINALS" ||
      m.stage === "FINAL";

    if (!isKnockout) continue;

    const isInMatch = home === team || away === team;

    if (!isInMatch) continue;

    const lost =
      (home === team && winner === "AWAY_TEAM") ||
      (away === team && winner === "HOME_TEAM");

    if (lost) {
      eliminated = true;
    }
  }

  return {
    isAlive: !eliminated,
  };
}