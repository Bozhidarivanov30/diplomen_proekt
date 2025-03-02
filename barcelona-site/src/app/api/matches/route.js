export async function GET() {
    const API_URL = "http://api.football-data.org/v4/teams/81/matches";
    const API_KEY = "ccd1ed853c494c27813971cc236d4022"; // Your actual API key
  
    try {
      const response = await fetch(API_URL, {
        headers: {
          "X-Auth-Token": API_KEY,
        },
      });
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch matches" }), { status: response.status });
      }
  
      const data = await response.json();
  
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  