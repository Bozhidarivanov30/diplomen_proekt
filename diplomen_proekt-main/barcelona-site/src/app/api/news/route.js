export async function GET() {
    const API_URL = "https://newsapi.org/v2/everything?q=fcbarcelona&sortBy=publishedAt";
    const API_KEY = "1a9affa9363541a89be79336c12a99f5"; 
  
    try {
      const response = await fetch(`${API_URL}&apiKey=${API_KEY}`);
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch news" }), { status: response.status });
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
  