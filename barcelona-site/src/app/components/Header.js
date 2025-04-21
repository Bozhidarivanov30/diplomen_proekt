"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "../context/UserContext";
import { useState } from "react";

export default function Header() {
  const { user, logoutUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <header className="bg-blue-900 flex items-center justify-between px-6 py-4 w-full relative">
      {/* Left side - Logo and Navigation */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Image
            src="https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png"
            alt="FC Barcelona Crest"
            width={60}
            height={60}
            className="h-12 w-12"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex text-white space-x-4">
          <Link href="/shop" className="px-3 py-2 hover:underline text-sm">
            Магазин
          </Link>
          <Link href="/standings" className="px-3 py-2 hover:underline text-sm">
            Класиране
          </Link>
        </nav>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:text-blue-200 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Right side - Auth buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-900 rounded-md hover:bg-gray-200"
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

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                  <Link href="/cart">
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Количка
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Излез
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Link href="/Login">
              <button className="px-4 py-2 bg-white text-blue-900 rounded-md hover:bg-gray-200">
                Вход
              </button>
            </Link>
            <Link href="/Register">
              <button className="px-4 py-2 bg-white text-blue-900 rounded-md hover:bg-gray-200">
                Регистрация
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu dropdown (not full page) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-blue-800 z-50 shadow-lg">
          <div className="flex flex-col px-6 py-3">
            <Link
              href="/shop"
              className="text-white py-3 hover:bg-blue-700 rounded px-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Магазин
            </Link>
            <Link
              href="/standings"
              className="text-white py-3 hover:bg-blue-700 rounded px-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Класиране
            </Link>
            
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-blue-200 py-3 hover:bg-blue-700 rounded px-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Профил
                </Link>
                <Link
                  href="/cart"
                  className="text-blue-200 py-3 hover:bg-blue-700 rounded px-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Количка
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-blue-200 py-3 hover:bg-blue-700 rounded px-3 text-left"
                >
                  Излез
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/Login"
                  className="text-blue-200 py-3 hover:bg-blue-700 rounded px-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Вход
                </Link>
                <Link
                  href="/Register"
                  className="text-blue-200 py-3 hover:bg-blue-700 rounded px-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}