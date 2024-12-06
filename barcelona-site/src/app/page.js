import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-center">Welcome to the Barcelona Shop</h1>
      
      <div className="mt-6 space-x-4">
        <Link href="/shop">
          <button className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700">
            Shop Now
          </button>
        </Link>
        <Link href="/games">
          <button className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-700">
            Latest Games
          </button>
        </Link>
      </div>
    </div>
  );
}
