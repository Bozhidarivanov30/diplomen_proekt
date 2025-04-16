"use client"; // Add this directive to use client-side features like useState

import { useState, useEffect } from "react";
import Link from "next/link";
import { UpcomingMatches } from "./components/upcoming-matches";
import { LatestNews } from "./components/latest-news";

export default function Home() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status when component loads
  useEffect(() => {
    // Проверка дали потребителят е логнат
    // Може да проверите за токен, сесия или друг метод за автентикация
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('userToken');
        setIsLoggedIn(!!token);
      } catch (error) {
        // В случай на грешка с localStorage на сървъра
        console.error('Error checking authentication:', error);
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-[#A50044] text-white py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Здравейте в Barça Fan Hub</h1>
            <p className="text-xl mb-8">Най-доброто място за всички теми свързани с FC Barcelona</p>

            {/* Показваме бутона само ако потребителят НЕ е логнат */}
            {!isLoggedIn && (
              <Link
                href="/Register" // Използваме абсолютен път за по-добра надеждност
                className="bg-white text-[#A50044] px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-colors"
              >
                Присъедини се към клуба
              </Link>
            )}
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <LatestNews />
            <UpcomingMatches />
          </div>
        </section>
      </main>

      <footer className="bg-[#004D98] text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Barça Fan Hub. All rights reserved.</p>
          <div className="mt-4">
            <Link href="/privacy" className="hover:underline mr-4">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
