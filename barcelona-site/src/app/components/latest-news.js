"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function LatestNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = "1a9affa9363541a89be79336c12a99f5"; // Replace with your NewsAPI key
        const query = "FC Barcelona";
        const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();
        setNews(data.articles.slice(0, 3)); // Show only the first 3 articles
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p>Loading news...</p>;
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
      <Link href="/news" className="mt-4 inline-block text-[#004D98] hover:underline">
        View all news
      </Link>
    </div>
  );
}