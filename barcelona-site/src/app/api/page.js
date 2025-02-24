import fetch from "node-fetch";

export default async function handler(req, res) {
  const { endpoint } = req.query;

  try {
    let url;
    if (endpoint === "news") {
      const query = "FC Barcelona";
      const apiKey = process.env.NEWS_API_KEY;
      url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;
    } else if (endpoint === "matches") {
      const teamId = 81; // FC Barcelona's team ID
      const apiKey = process.env.FOOTBALL_DATA_API_KEY;
      url = `https://api.football-data.org/v4/teams/${teamId}/matches`;
    } else if (endpoint === "rankings") {
      const apiKey = process.env.FOOTBALL_DATA_API_KEY;
      url = "https://api.football-data.org/v4/competitions/PD/standings";
    } else {
      throw new Error("Invalid endpoint");
    }

    const response = await fetch(url, {
      headers: {
        "X-Auth-Token": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}