"use client";

import { useEffect, useState } from "react";

export function LatestNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const url = "/api/news"; // Fetch from your Next.js API route

        console.log("Fetching news from:", url);

        const response = await fetch(url);
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response data:", data);

        if (data.articles && data.articles.length > 0) {
          setNews(data.articles.slice(0, 3)); // Show only the first 3 articles
        } else {
          setError("No news articles found.");
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p>Loading news...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Latest News</h2>
      <ul className="space-y-4">
        {news.length > 0 ? (
          news.map((article) => (
            <li key={article.url} className="border-b pb-2">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#A50044]"
              >
                <h3 className="font-semibold">{article.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </a>
            </li>
          ))
        ) : (
          <p>No news found.</p>
        )}
      </ul>
    </div>
  );
}
