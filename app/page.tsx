"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState("groups");

  async function load() {
    const res = await fetch("/api/leaderboard", {
      cache: "no-store",
    });

    if (!res.ok) return;

    const text = await res.text();
    if (!text) return;

    try {
      setData(JSON.parse(text));
    } catch (e) {
      console.error("Invalid JSON from API", e);
    }
  }

  useEffect(() => {
    load();
    const i = setInterval(load, 60000);
    return () => clearInterval(i);
  }, []);

  if (!data) {
    return (
      <div className="p-6 bg-gray-950 text-gray-200 min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-950 text-gray-100 min-h-screen">
      {/* ================= TABS ================= */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { id: "groups", label: "GROUPS" },
          { id: "knockout", label: "KNOCKOUT" },
          { id: "topscorers", label: "POT 1&2 SCORED" },
          { id: "scored", label: "POT 3&4 SCORED" },
          { id: "conceded", label: "CONCEDED" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1 rounded text-sm ${
              tab === t.id
                ? "bg-white text-black"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ================= GROUPS ================= */}
      {tab === "groups" && (
        <div className="space-y-6">
          {Object.entries(data.groups)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([group, teams]: any) => (
            <div key={group}>
              <h2 className="font-bold text-lg mb-2">{group}</h2>

              <table className="w-full text-sm bg-gray-900 rounded table-fixed">
                <thead className="text-gray-300 border-b border-gray-700">
                  <tr>
                    <th className="p-2 text-left w-1/3">Team</th>
                    <th className="p-2 text-left w-1/3">Player</th>
                    <th className="p-2 w-12">P</th>
                    <th className="p-2 w-12">Pts</th>
                    <th className="p-2 w-12">GF</th>
                    <th className="p-2 w-12">GA</th>
                    <th className="p-2 w-12">GD</th>
                  </tr>
                </thead>

                <tbody>
                  {teams.map((t: any, i: number) => (
                    <tr
                      key={`${t.team ?? "team"}-${t.participant ?? "player"}-${i}`}
                      className="border-t border-gray-800 hover:bg-gray-800"
                    >
                      <td className="p-2 truncate">{t.team ?? "-"}</td>

                      <td className="p-2 text-gray-300 truncate">
                        {t.participant ?? ""}
                      </td>

                      <td className="p-2 text-center">{t.played ?? 0}</td>
                      <td className="p-2 text-center font-semibold">
                        {t.points ?? 0}
                      </td>
                      <td className="p-2 text-center">{t.goalsFor ?? 0}</td>
                      <td className="p-2 text-center">
                        {t.goalsAgainst ?? 0}
                      </td>
                      <td className="p-2 text-center">
                        {(t.goalsFor ?? 0) - (t.goalsAgainst ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* ================= KNOCKOUT ================= */}
      {tab === "knockout" && (
        <div className="space-y-6">
          {data.knockout?.stages?.map((s: any, si: number) => (
            <div key={`${s.stage}-${si}`}>
              <h2 className="font-bold mb-2">{s.stage}</h2>

              {s.matches?.map((m: any, i: number) => (
                <div
                  key={`${m.home ?? "h"}-${m.away ?? "a"}-${i}`}
                  className="bg-gray-900 border border-gray-800 p-3 mb-2 rounded"
                >
                  {m.home ?? "TBD"} ({m.homeOwner ?? "-"}) vs{" "}
                  {m.away ?? "TBD"} ({m.awayOwner ?? "-"})
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ================= SCORED ================= */}
      {tab === "scored" && (
        <div>
          <h2 className="text-sm text-gray-300 mb-4">
            This table shows the teams from Pot 3 and Pot 4 that have scored the most goals so far.
          </h2>

          <table className="w-full text-sm bg-gray-900 rounded table-fixed">
            <thead className="text-gray-300 border-b border-gray-700">
              <tr>
                <th className="p-2 w-12">Rank</th>
                <th className="p-2 text-left w-1/3">Team</th>
                <th className="p-2 text-left w-1/3">Player</th>
                <th className="p-2 w-20">Goals</th>
              </tr>
            </thead>

            <tbody>
              {data.goalsScoredRanking?.map((t: any, i: number) => (
                <tr
                  key={`${t.team ?? "team"}-${i}`}
                  className={`border-t border-gray-800 hover:bg-gray-800 ${
                    t.eliminated ? "text-red-400" : ""
                  }`}
                >
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2 truncate">{t.team ?? "-"}</td>
                  <td className="p-2 text-gray-300 truncate">
                    {t.participant ?? "-"}
                  </td>
                  <td className="p-2 text-center font-semibold">
                    {t.goalsFor ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= CONCEDED ================= */}
      {tab === "conceded" && (
        <div>
          <h2 className="text-sm text-gray-300 mb-4">
            This table shows the teams from Pot 3 and Pot 4 that have conceded the most goals so far.
          </h2>

          <table className="w-full text-sm bg-gray-900 rounded table-fixed">
            <thead className="text-gray-300 border-b border-gray-700">
              <tr>
                <th className="p-2 w-12">Rank</th>
                <th className="p-2 text-left w-1/3">Team</th>
                <th className="p-2 text-left w-1/3">Player</th>
                <th className="p-2 w-20">Conceded</th>
              </tr>
            </thead>

            <tbody>
              {data.goalsConcededRanking?.map((t: any, i: number) => (
                <tr
                  key={`${t.team ?? "team"}-${i}`}
                  className={`border-t border-gray-800 hover:bg-gray-800 ${
                    t.eliminated ? "text-red-400" : ""
                  }`}
                >
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2 truncate">{t.team ?? "-"}</td>
                  <td className="p-2 text-gray-300 truncate">
                    {t.participant ?? "-"}
                  </td>
                  <td className="p-2 text-center font-semibold">
                    {t.goalsAgainst ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* ================= TOP TEAM GOALSCORERS ================= */}
{tab === "topscorers" && (
  <div>
    <h2 className="text-sm text-gray-300 mb-4">
      This table shows the top-bracket teams ranked by goals scored so far.
    </h2>

    <table className="w-full text-sm bg-gray-900 rounded table-fixed">
      <thead className="text-gray-300 border-b border-gray-700">
        <tr>
          <th className="p-2 w-12">Rank</th>
          <th className="p-2 text-left w-1/3">Team</th>
          <th className="p-2 text-left w-1/3">Player</th>
          <th className="p-2 w-20">Goals</th>
        </tr>
      </thead>

      <tbody>
        {data.topTeamsGoalsRanking?.map((t: any, i: number) => (
          <tr
            key={`${t.team ?? "team"}-${i}`}
            className={`border-t border-gray-800 hover:bg-gray-800 ${
              t.eliminated ? "text-red-400" : ""
            }`}
          >
            <td className="p-2 text-center">{i + 1}</td>

            <td className="p-2 truncate">
              {t.team ?? "-"}
            </td>

            <td className="p-2 text-gray-300 truncate">
              {t.participant ?? "-"}
            </td>

            <td className="p-2 text-center font-semibold">
              {t.goalsFor ?? 0}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </div>
    
  );
}