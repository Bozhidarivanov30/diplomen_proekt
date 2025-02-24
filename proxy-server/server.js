require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy endpoint for newsapi.org
app.get("/api/news", async (req, res) => {
  try {
    const query = req.query.q || "FC Barcelona";
    const apiKey = process.env.NEWS_API_KEY; // Use your NewsAPI key
    const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;

    const fetch = (await import("node-fetch")).default; // Dynamic import
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// Proxy endpoint for football-data.org
app.get("/api/matches", async (req, res) => {
  try {
    const teamId = req.query.teamId || 81; // FC Barcelona's team ID
    const apiKey = process.env.FOOTBALL_DATA_API_KEY; // Use your Football Data API key
    const url = `https://api.football-data.org/v4/teams/${teamId}/matches`;

    const fetch = (await import("node-fetch")).default; // Dynamic import
    const response = await fetch(url, {
      headers: {
        "X-Auth-Token": apiKey,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
