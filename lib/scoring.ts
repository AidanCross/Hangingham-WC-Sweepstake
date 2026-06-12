export function getTeamProgressPoints(team: string, matches: any[]) {
  let points = 0;

  for (const m of matches) {
    const home = m.homeTeam?.name;
    const away = m.awayTeam?.name;
    const winner = m.score?.winner;

    const isWinner =
      (home === team && winner === "HOME_TEAM") ||
      (away === team && winner === "AWAY_TEAM");

    if (!isWinner) continue;

    points += 3;

    switch (m.stage) {
      case "QUARTER_FINALS":
        points += 5;
        break;
      case "SEMI_FINALS":
        points += 10;
        break;
      case "FINAL":
        points += 20;
        break;
    }
  }

  return points;
}

export function getGoalsConceded(team: string, matches: any[]) {
  let conceded = 0;

  for (const m of matches) {
    const home = m.homeTeam?.name;
    const away = m.awayTeam?.name;

    const homeGoals = m.score?.fullTime?.home ?? 0;
    const awayGoals = m.score?.fullTime?.away ?? 0;

    if (home === team) conceded += awayGoals;
    if (away === team) conceded += homeGoals;
  }

  return conceded;
}

export function getGoalsScored(team: string, matches: any[]) {
  let goals = 0;

  for (const m of matches) {
    const home = m.homeTeam.name;
    const away = m.awayTeam.name;

    const hg = m.score.fullTime.home;
    const ag = m.score.fullTime.away;

    if (home === team) goals += hg;
    if (away === team) goals += ag;
  }

  return goals;
}