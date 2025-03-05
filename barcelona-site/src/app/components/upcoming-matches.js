"use client"; // Ensure this is at the very top

import { useEffect, useState } from "react";
import Link from "next/link";

export function UpcomingMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const url = "/api/matches"; // Use your Next.js API instead of external API

        console.log("Fetching matches from:", url);

        const response = await fetch(url);
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch matches: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response data:", data);

        const scheduledMatches = data.matches.filter(
          (match) => match.status === "SCHEDULED"
        );
        setMatches(scheduledMatches.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch matches:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <p>Loading matches...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upcoming Matches</h2>
      <ul className="space-y-4">
        {matches.length > 0 ? (
          matches.map((match) => (
            <li key={match.id} className="border-b pb-2">
              <Link href={`/matches/${match.id}`} className="hover:text-[#A50044]">
                <h3 className="font-semibold">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {match.competition.name} - {new Date(match.utcDate).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))
        ) : (
          <p>No upcoming matches found.</p>
        )}
      </ul>
      <Link href="/standings" className="mt-4 inline-block text-[#004D98] hover:underline">
        View all matches
      </Link>
    </div>
  );
}
