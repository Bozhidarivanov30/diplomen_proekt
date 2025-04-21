"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function StandingsPage() {
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchOffset, setMatchOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch("/api/standings");
        if (!response.ok) {
          throw new Error(`Failed to fetch standings: ${response.statusText}`);
        }
        const data = await response.json();
        setStandings(data.standings[0].table);
      } catch (error) {
        console.error("Failed to fetch standings:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("/api/matches");
        if (!response.ok) {
          throw new Error(`Failed to fetch matches: ${response.statusText}`);
        }
        const data = await response.json();
        const scheduledMatches = data.matches.filter(
          (match) => match.status === "SCHEDULED"
        );
        setMatches(scheduledMatches);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
        setError(error.message);
      }
    };

    fetchMatches();
  }, []);

  const handleNextMatches = () => {
    if (matchOffset + 3 < matches.length) {
      setMatchOffset(matchOffset + 3);
    }
  };

  const handlePreviousMatches = () => {
    if (matchOffset - 3 >= 0) {
      setMatchOffset(matchOffset - 3);
    }
  };

  const displayedMatches = matches.slice(matchOffset, matchOffset + 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <p>Зареждане...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">
        Ла лига класиране и следващите мачове на Барселона
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Standings Table - 50% width on desktop */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md lg:w-1/2">
          <h2 className="text-lg md:text-xl font-bold mb-4">Сегашно класиране</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Позиция</th>
                  <th className="p-2 text-left">Отбор</th>
                  <th className="p-2 text-left">М</th>
                  <th className="p-2 text-left">П</th>
                  <th className="p-2 text-left">Р</th>
                  <th className="p-2 text-left">З</th>
                  <th className="p-2 text-left">Т</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team) => (
                  <tr key={team.position} className="border-b">
                    <td className="p-2">{team.position}</td>
                    <td className="p-2">{team.team.name}</td>
                    <td className="p-2">{team.playedGames}</td>
                    <td className="p-2">{team.won}</td>
                    <td className="p-2">{team.draw}</td>
                    <td className="p-2">{team.lost}</td>
                    <td className="p-2 ">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Barcelona Matches - 50% width on desktop */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md lg:w-1/2">
          <h2 className="text-lg md:text-xl font-bold mb-4">
            Следващи мачове на Барселона
          </h2>
          <div className="flex items-center justify-center mb-4">
            <Image
              src="https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png"
              alt="Barcelona Crest"
              width={120}
              height={120}
              className="w-24 h-24"
              priority
            />
          </div>
          
          <div className="space-y-4">
            {displayedMatches.map((match) => (
              <div key={match.id} className="border p-4 rounded-lg">
                <p className="font-bold">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </p>
                <p>
                  {new Date(match.utcDate).toLocaleDateString("bg-BG")} -{" "}
                  {new Date(match.utcDate).toLocaleTimeString("bg-BG", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
                <p className="text-gray-600">
                  {match.competition.name}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousMatches}
              disabled={matchOffset === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Предишни
            </button>
            <button
              onClick={handleNextMatches}
              disabled={matchOffset + 3 >= matches.length}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Следващи
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}