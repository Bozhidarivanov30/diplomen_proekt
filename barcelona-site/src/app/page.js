"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UpcomingMatches } from "./components/upcoming-matches";
import { LatestNews } from "./components/latest-news";
import { getAuth } from "firebase/auth";
import { app } from "./firebase.js"; 

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-[#A50044] text-white py-10 sm:py-16 md:py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Здравейте в Barça Fan Hub
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
              Най-доброто място за всички теми свързани с FC Barcelona
            </p>
            
            {!isLoggedIn && (
              <Link
                href="/Register"
                className="inline-block bg-white text-[#A50044] px-4 sm:px-5 md:px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-colors text-sm sm:text-base"
              >
                Присъедини се към клуба
              </Link>
            )}
          </div>
        </section>

        {/* Content Section */}
        <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-5 sm:p-6 md:p-7">
                  <LatestNews />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-5 sm:p-6 md:p-7">
                  <UpcomingMatches />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#004D98] text-white py-6 sm:py-8 px-4">
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