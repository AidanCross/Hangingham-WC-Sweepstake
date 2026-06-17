import participants from "@/data/participants.json";
import { fetchMatches } from "@/lib/api";
import { buildGroups } from "@/lib/groups";
import { buildKnockout } from "@/lib/knockout";
import {
  getGoalsConceded,
  getGoalsScored,
} from "@/lib/scoring";
import { getTeamStatus } from "@/lib/teamStatus";

export async function GET() {
  const matches = await fetchMatches();

  // ---------------- GROUPS ----------------
  const groups = buildGroups(matches);

  // ---------------- KNOCKOUT ----------------
  const knockout = buildKnockout(matches, participants);

  // ---------------- POT 3/4 (BOTTOM TEAMS) ----------------
  const bottomTeams = participants.map((p) => {
    const status = getTeamStatus(p.bottomTeam, matches);

    return {
      team: p.bottomTeam,
      participant: p.name,
      goalsFor: getGoalsScored(p.bottomTeam, matches),
      goalsAgainst: getGoalsConceded(p.bottomTeam, matches),
      eliminated: !status.isAlive,
    };
  });

  const goalsScoredRanking = [...bottomTeams].sort(
    (a, b) => b.goalsFor - a.goalsFor
  );

  const goalsConcededRanking = [...bottomTeams].sort(
    (a, b) => b.goalsAgainst - a.goalsAgainst
  );

  // ---------------- TOP TEAMS ----------------
  const topTeamsGoalsRanking = participants
    .map((p) => {
      const status = getTeamStatus(p.topTeam, matches);

      return {
        team: p.topTeam,
        participant: p.name,
        goalsFor: getGoalsScored(p.topTeam, matches),
        eliminated: !status.isAlive,
      };
    })
    .sort((a, b) => b.goalsFor - a.goalsFor);

  return Response.json({
    groups,
    knockout,
    goalsScoredRanking,
    goalsConcededRanking,
    topTeamsGoalsRanking,
  });
}