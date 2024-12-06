
export default function GamesPage() {
    const games = [
      { id: 1, opponent: 'Real Madrid', date: '2024-12-01', venue: 'Camp Nou' },
      { id: 2, opponent: 'Atletico Madrid', date: '2024-12-10', venue: 'Wanda Metropolitano' },
      { id: 3, opponent: 'Sevilla FC', date: '2024-12-18', venue: 'Ramon Sanchez Pizjuan' },
    ];
  
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Upcoming Games
        </h1>
        <div className="max-w-4xl mx-auto space-y-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {game.opponent}
                </h2>
                <p className="text-gray-600">{game.date}</p>
              </div>
              <p className="text-gray-700">{game.venue}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  