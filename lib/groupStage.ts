export function buildGroupTable(matches: any[]) {
  const table: Record<string, any> = {};

  const groupMatches = matches.filter(
    (m) => m.stage === "GROUP_STAGE" && m.status === "FINISHED"
  );

  for (const m of groupMatches) {
    const home = m.homeTeam.name;
    const away = m.awayTeam.name;

    const hg = m.score.fullTime.home;
    const ag = m.score.fullTime.away;

    if (!table[home]) table[home] = init(home);
    if (!table[away]) table[away] = init(away);

    update(table[home], hg, ag);
    update(table[away], ag, hg);

    if (hg > ag) table[home].points += 3;
    else if (ag > hg) table[away].points += 3;
    else {
      table[home].points += 1;
      table[away].points += 1;
    }
  }

  return table;
}

function init(team: string) {
  return {
    team,
    played: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
  };
}

function update(teamObj: any, gf: number, ga: number) {
  teamObj.played += 1;
  teamObj.goalsFor += gf;
  teamObj.goalsAgainst += ga;
  teamObj.goalDiff = teamObj.goalsFor - teamObj.goalsAgainst;
}