export default function ShopPage() {
    const items = [
      { id: 1, name: "Official Barcelona Jersey", price: "$89.99" },
      { id: 2, name: "Barcelona Scarf", price: "$19.99" },
      { id: 3, name: "Match Day Poster", price: "$9.99" },
    ];
  
    return (
      <div>
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Barcelona Shop
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center"
            >
              <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
              <p className="mt-2 text-gray-600">{item.price}</p>
              <button className="mt-4 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-700">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  

  