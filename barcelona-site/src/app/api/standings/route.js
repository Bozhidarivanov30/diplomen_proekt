// app/api/standings/route.js
export async function GET() {
    const API_URL = "http://api.football-data.org/v4/competitions/PD/standings";
    const API_KEY = "ccd1ed853c494c27813971cc236d4022"; // Replace with your API key
  
    try {
      const response = await fetch(API_URL, {
        headers: {
          "X-Auth-Token": API_KEY,
        },
      });
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch standings" }), {
          status: response.status,
        });
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