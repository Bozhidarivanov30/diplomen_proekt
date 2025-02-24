import { useEffect, useState } from "react";
import Link from "next/link";

export default function Fixtures() {
  const [rankings, setRankings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rankings
        const rankingsResponse = await fetch("https://diplomen-proekt.vercel.app/api/proxy?endpoint=rankings");
        if (!rankingsResponse.ok) {
          throw new Error("Failed to fetch rankings");
        }
        const rankingsData = await rankingsResponse.json();
        setRankings(rankingsData);

        // Fetch matches
        const matchesResponse = await fetch("https://your-vercel-app.vercel.app/api/proxy?endpoint=matches");
        if (!matchesResponse.ok) {
          throw new Error("Failed to fetch matches");
        }
        const matchesData = await matchesResponse.json();
        setMatches(matchesData.matches);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">Fixtures</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rankings Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Team Rankings</h2>
          <ul className="space-y-2">
            {rankings.map((team, index) => (
              <li
                key={team.id}
                className={`p-2 rounded ${
                  team.name === "Barcelona" ? "bg-[#A50044] text-white" : "bg-gray-100"
                }`}
              >
                {index + 1}. {team.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Matches Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Matches</h2>
          <ul className="space-y-4">
            {matches
              .filter((match) => match.status === "SCHEDULED")
              .slice(0, 5) // Show only the next 5 matches
              .map((match) => (
                <li key={match.id} className="border-b pb-2">
                  <div className="font-semibold">
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {match.competition.name} - {new Date(match.utcDate).toLocaleDateString()}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}