import participants from "@/data/participants.json";
import { fetchMatches } from "@/lib/api";
import { buildGroups } from "@/lib/groups";
import { buildKnockout, getFurthestStage } from "@/lib/knockout";
import {
  getGoalsConceded,
  getGoalsScored,
  getTeamProgressPoints,
} from "@/lib/scoring";
import { getNextMatch } from "@/lib/nextMatch";
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

  return Response.json({
    groups,
    knockout,
    goalsScoredRanking,
    goalsConcededRanking,
  });
}