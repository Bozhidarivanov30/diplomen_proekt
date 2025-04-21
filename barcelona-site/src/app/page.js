"use client"; // Add this directive to use client-side features like useState

import { useState } from "react";
import Link from "next/link";
import { UpcomingMatches } from "./components/upcoming-matches";
import { LatestNews } from "./components/latest-news";
import { getAuth } from "firebase/auth";
import { app } from "./firebase.js"; 

export default function Home() {
  // State to track if the user has registered
  const [hasRegistered, setHasRegistered] = useState(false);

  // Function to handle registration
  const handleRegister = () => {
    // Simulate registration logic (e.g., API call)
    // After successful registration, set hasRegistered to true
    setHasRegistered(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-[#A50044] text-white py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Здравейте в Barça Fan Hub</h1>
            <p className="text-xl mb-8">Най доброто място за всички теми свързани с FC Barcelona</p>

            {/* Conditionally render the button */}
            {!hasRegistered && (
              <Link
                href="/Register" // Use an absolute path for better reliability
                onClick={handleRegister} // Call handleRegister when the button is clicked
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
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Barça Fan Hub. All rights reserved.
          </p>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/privacy" className="hover:underline text-sm sm:text-base">
            Политика за поверителност
            </Link>
            <Link href="/terms" className="hover:underline text-sm sm:text-base">
              Условия за ползване
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
