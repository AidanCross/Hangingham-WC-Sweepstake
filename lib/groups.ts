import participants from "@/data/participants.json";
import { buildGroupTable } from "./groupStage";

export function buildGroups(matches: any[]) {
  const table = buildGroupTable(matches);

  const groups: Record<string, any[]> = {};

  const groupMatches = matches.filter(
    (m) => m.stage === "GROUP_STAGE"
  );

  for (const m of groupMatches) {
    const group = m.group;
    if (!group) continue;

    if (!groups[group]) {
      groups[group] = [];
    }

    const addTeam = (team: string) => {
      if (!team) return;

      if (groups[group].some((x) => x.team === team)) return;

      // 🔥 FIND PARTICIPANT OWNER (top or bottom team)
      const owner = participants.find(
        (p) =>
          p.topTeam === team || p.bottomTeam === team
      );

      groups[group].push({
        ...(table[team] || {
          team,
          played: 0,
          points: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDiff: 0,
        }),
        participant: owner?.name ?? "",
      });
    };

    addTeam(m.homeTeam?.name);
    addTeam(m.awayTeam?.name);
  }

  // sort like real table
  for (const g of Object.keys(groups)) {
    groups[g] = groups[g].sort((a, b) => {
      return (
        b.points - a.points ||
        b.goalDiff - a.goalDiff ||
        b.goalsFor - a.goalsFor
      );
    });
  }

  return groups;
}