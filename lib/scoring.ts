function getMatchGoals(m: any) {
  const isPens = m.score?.duration === "PENALTY_SHOOTOUT";

  if (isPens) {
    const regular = m.score?.regularTime;
    const extra = m.score?.extraTime;

    return {
      home: (regular?.home ?? 0) + (extra?.home ?? 0),
      away: (regular?.away ?? 0) + (extra?.away ?? 0),
    };
  }

  return {
    home: m.score?.fullTime?.home ?? 0,
    away: m.score?.fullTime?.away ?? 0,
  };
}

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

    const { home: hg, away: ag } = getMatchGoals(m);

    if (home === team) conceded += ag;
    if (away === team) conceded += hg;
  }

  return conceded;
}

export function getGoalsScored(team: string, matches: any[]) {
  let goals = 0;

  for (const m of matches) {
    const home = m.homeTeam?.name;
    const away = m.awayTeam?.name;

    const { home: hg, away: ag } = getMatchGoals(m);

    if (home === team) goals += hg;
    if (away === team) goals += ag;
  }

  return goals;
}