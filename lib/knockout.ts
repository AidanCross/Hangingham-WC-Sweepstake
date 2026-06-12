export function buildKnockout(matches: any[], participants: any[]) {
  const stages = ["LAST_16", "QUARTER_FINALS", "SEMI_FINALS", "FINAL"];

  return {
    stages: stages.map((stage) => ({
      stage,
      matches: matches
        .filter((m) => m.stage === stage)
        .map((m) => ({
          home: m.homeTeam.name,
          away: m.awayTeam.name,
          homeOwner: getOwner(m.homeTeam.name, participants),
          awayOwner: getOwner(m.awayTeam.name, participants),
        })),
    })),
  };
}

function getOwner(team: string, participants: any[]) {
  return (
    participants.find(
      (p) => p.topTeam === team || p.bottomTeam === team
    )?.name ?? ""
  );
}

export function getFurthestStage(team: string, matches: any[]) {
  const order = [
    "GROUP_STAGE",
    "LAST_16",
    "QUARTER_FINALS",
    "SEMI_FINALS",
    "FINAL",
  ];

  let maxIndex = 0;

  for (const m of matches) {
    const involved =
      m.homeTeam.name === team || m.awayTeam.name === team;

    if (!involved) continue;

    const idx = order.indexOf(m.stage);
    if (idx > maxIndex) maxIndex = idx;
  }

  return order[maxIndex];
}