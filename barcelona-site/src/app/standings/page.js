"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function StandingsPage() {
  const [standings, setStandings] = useState([]); // State for standings data
  const [matches, setMatches] = useState([]); // State for matches data
  const [matchOffset, setMatchOffset] = useState(0); // State for match pagination
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling

  // Fetch standings data from your local API
  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch("/api/standings"); // Use local API route
        if (!response.ok) {
          throw new Error(`Failed to fetch standings: ${response.statusText}`);
        }
        const data = await response.json();
        setStandings(data.standings[0].table); // Extract the table data
      } catch (error) {
        console.error("Failed to fetch standings:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  // Fetch matches data from your local API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("/api/matches"); // Use local API route
        if (!response.ok) {
          throw new Error(`Failed to fetch matches: ${response.statusText}`);
        }
        const data = await response.json();
        setMatches(data.matches); // Extract the matches data
      } catch (error) {
        console.error("Failed to fetch matches:", error);
        setError(error.message);
      }
    };

    fetchMatches();
  }, []);

  // Handle match pagination
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

  // Filter matches to show only the next 3 (or up to 9)
  const displayedMatches = matches.slice(matchOffset, matchOffset + 3);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">La Liga Standings and Barcelona Matches</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Standings Table (Left Side) */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Current Standings</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Position</th>
                <th className="p-2 text-left">Team</th>
                <th className="p-2 text-left">Played</th>
                <th className="p-2 text-left">Wins</th>
                <th className="p-2 text-left">Draws</th>
                <th className="p-2 text-left">Losses</th>
                <th className="p-2 text-left">Points</th>
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
                  <td className="p-2">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Barcelona Matches (Right Side) */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Barcelona&apos;s Next Matches</h2>
          <div className="flex items-center justify-center mb-4">
            <Image
              src="https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png"
              alt="Barcelona Crest"
              width={100}
              height={100}
              className="w-24 h-24"
            />
          </div>
          <div className="space-y-4">
            {displayedMatches.map((match) => (
              <div key={match.id} className="border p-4 rounded-lg">
                <p className="font-bold">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </p>
                <p>
                  {new Date(match.utcDate).toLocaleDateString()} -{" "}
                  {new Date(match.utcDate).toLocaleTimeString()}
                </p>
                <p>{match.competition.name}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousMatches}
              disabled={matchOffset === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={handleNextMatches}
              disabled={matchOffset + 3 >= matches.length}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}