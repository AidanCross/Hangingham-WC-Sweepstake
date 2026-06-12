"use client";

import { useEffect, useState } from "react";

type NextMatch = {
  matchText: string;
  kickoff: string;
};

type Player = {
  name: string;
  topTeam: string;
  bottomTeam: string;
  topScore: number;
  bottomScore: number;
  nextTopMatch: NextMatch | null;
  nextBottomMatch: NextMatch | null;
  topAlive: boolean;
  bottomAlive: boolean;
};

type Data = {
  topBracket: Player[];
  bottomBracket: Player[];
};

export default function Home() {
  const [data, setData] = useState<Data | null>(null);

  async function load() {
    const res = await fetch("/api/leaderboard", {
      cache: "no-store",
    });
    setData(await res.json());
  }

  useEffect(() => {
    load();
    const i = setInterval(load, 60000);
    return () => clearInterval(i);
  }, []);

  if (!data) {
    return (
      <div className="p-6 text-gray-200 bg-gray-900 min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 grid md:grid-cols-2 gap-8 bg-gray-900 min-h-screen">
      {/* TOP BRACKET */}
      <div>
        <h1 className="text-xl font-bold mb-4 text-white">
          Top Bracket
        </h1>

        {data.topBracket.map((p) => (
          <div
            key={p.name}
            className={`p-4 rounded mb-4 border bg-white shadow-sm ${
              p.topAlive
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <div className="text-lg font-semibold text-gray-900">
              {p.name}
            </div>

            <div className="text-sm text-gray-600">
              {p.topTeam}
            </div>

            <div className="mt-1 text-gray-800">
              Score: {p.topScore}
            </div>

            <div className="mt-2 text-sm">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  p.topAlive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {p.topAlive ? "In tournament" : "Eliminated"}
              </span>

              <div className="mt-2 text-gray-700">
                <div className="font-semibold text-gray-900">
                  Next match
                </div>

                {p.nextTopMatch ? (
                  <>
                    <div>{p.nextTopMatch.matchText}</div>
                    <div className="text-gray-500">
                      {new Date(
                        p.nextTopMatch.kickoff
                      ).toLocaleString()}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">
                    No upcoming match
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM BRACKET */}
      <div>
        <h1 className="text-xl font-bold mb-4 text-white">
          Bottom Bracket
        </h1>

        {data.bottomBracket.map((p) => (
          <div
            key={p.name}
            className={`p-4 rounded mb-4 border bg-white shadow-sm ${
              p.bottomAlive
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <div className="text-lg font-semibold text-gray-900">
              {p.name}
            </div>

            <div className="text-sm text-gray-600">
              {p.bottomTeam}
            </div>

            <div className="mt-1 text-gray-800">
              Goals conceded: {p.bottomScore}
            </div>

            <div className="mt-2 text-sm">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  p.bottomAlive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {p.bottomAlive ? "In tournament" : "Eliminated"}
              </span>

              <div className="mt-2 text-gray-700">
                <div className="font-semibold text-gray-900">
                  Next match
                </div>

                {p.nextBottomMatch ? (
                  <>
                    <div>{p.nextBottomMatch.matchText}</div>
                    <div className="text-gray-500">
                      {new Date(
                        p.nextBottomMatch.kickoff
                      ).toLocaleString()}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">
                    No upcoming match
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}