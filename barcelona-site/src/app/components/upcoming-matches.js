"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function UpcomingMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Use the proxy server URL for matches
        const url = "http://localhost:3001/api/matches";

        console.log("Fetching matches from:", url);

        const response = await fetch(url);
        console.log("Response status:", response.status);

        if (!response.ok) {
          // Handle HTTP errors
          if (response.status === 403) {
            throw new Error("Invalid API key. Please check your API key.");
          } else if (response.status === 429) {
            throw new Error("API rate limit exceeded. Please try again later.");
          } else {
            throw new Error(`Failed to fetch matches: ${response.statusText}`);
          }
        }

        const data = await response.json();
        console.log("Response data:", data);

        // Filter for scheduled matches
        const scheduledMatches = data.matches.filter(
          (match) => match.status === "SCHEDULED"
        );
        setMatches(scheduledMatches.slice(0, 3)); // Show only the first 3 matches
      } catch (error) {
        console.error("Failed to fetch matches:", error);
        setError(error.message); // Display the error message to the user
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
      <Link href="/matches" className="mt-4 inline-block text-[#004D98] hover:underline">
        View all matches
      </Link>
    </div>
  );
}