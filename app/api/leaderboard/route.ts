import participants from "@/data/participants.json";
import { fetchMatches } from "@/lib/api";
import {
  getTeamProgressPoints,
  getGoalsConceded,
} from "@/lib/scoring";
import { getNextMatch } from "@/lib/nextMatch";
import { getTeamStatus } from "@/lib/teamStatus";
export async function GET() {
  const matches = await fetchMatches();

  const results = participants.map((p) => {
  const topStatus = getTeamStatus(p.topTeam, matches);
  const bottomStatus = getTeamStatus(p.bottomTeam, matches);

  return {
    name: p.name,
    topTeam: p.topTeam,
    bottomTeam: p.bottomTeam,

    topScore: getTeamProgressPoints(p.topTeam, matches),
    bottomScore: getGoalsConceded(p.bottomTeam, matches),

    nextTopMatch: getNextMatch(p.topTeam, matches),
    nextBottomMatch: getNextMatch(p.bottomTeam, matches),

    topAlive: topStatus.isAlive,
    bottomAlive: bottomStatus.isAlive,
  };
});

  return Response.json({
    topBracket: [...results].sort((a, b) => b.topScore - a.topScore),
    bottomBracket: [...results].sort(
      (a, b) => b.bottomScore - a.bottomScore
    ),
  });
}