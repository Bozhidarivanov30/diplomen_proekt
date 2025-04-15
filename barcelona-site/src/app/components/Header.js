"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "../context/UserContext";
import { useState } from "react";

export default function Header() {
  const { user, logoutUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsDropdownOpen(false); // Close dropdown after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <header className="bg-blue-900 flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-4">
        <Link href="/">
          {/* Replace <img> with <Image /> */}
          <Image
            src="https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png"
            alt="FC Barcelona Crest"
            width={60} // Set the width
            height={60} // Set the height
            style={{ width: "auto", height: "auto" }} // Maintain aspect ratio
          />
        </Link>
        <nav className="text-white text-sm">
          <Link href="/shop" className="px-3 py-2 hover:underline">
            Магазин
          </Link>
          <Link href="/standings" className="px-3 py-2 hover:underline">
            Класиране
          </Link>
        </nav>
      </div>
      <div className="space-x-4">
        {user ? (
          <div className="relative">
            {/* User button to toggle dropdown */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown on click
              className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-900 rounded-md"
            >
              <span>{user.email}</span>
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

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setIsDropdownOpen(false)} // Close dropdown when clicking outside
                ></div>

                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Излез
                  </button>
                  <Link href="/cart">
                    <button
                      onClick={() => setIsDropdownOpen(false)} // Close dropdown when navigating
                      className="px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      Преглед на количката
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link href="/Login">
              <button className="px-4 py-2 bg-white text-blue-900 rounded-md hover:bg-gray-200">
                Log In
              </button>
            </Link>
            <Link href="/Register">
              <button className="px-4 py-2 bg-white text-blue-900 rounded-md hover:bg-gray-200">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}