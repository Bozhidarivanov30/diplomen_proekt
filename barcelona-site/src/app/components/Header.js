"use client";

import Link from "next/link";
import { useUser } from "../context/UserContext";

export default function Header() {
  const { user, logout } = useUser();

  return (
    <header className="bg-blue-500 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">Barcelona Fan Shop</h1>
      <div>
        {user ? (
          <div className="relative group">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-700 rounded hover:bg-blue-900">
              <span>{user}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06L10 13.06 6.29 9.37a.75.75 0 01-.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg hidden group-hover:block">
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Log Out
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => alert("Cart functionality not implemented yet.")}
              >
                View Cart
              </button>
            </div>
          </div>
        ) : (
          <Link href="/Login">
            <button className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-900">
              Login to Shop
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
