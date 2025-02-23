"use client"; // Add this directive to use client-side features like useState

import { useState } from "react";
import Link from "next/link";
import { UpcomingMatches } from "./components/upcoming-matches";
import { LatestNews } from "./components/latest-news";

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
            <h1 className="text-4xl font-bold mb-4">Welcome to Barça Fan Hub</h1>
            <p className="text-xl mb-8">Your ultimate destination for all things FC Barcelona</p>

            {/* Conditionally render the button */}
            {!hasRegistered && (
              <Link
                href="/Register" // Use an absolute path for better reliability
                onClick={handleRegister} // Call handleRegister when the button is clicked
                className="bg-white text-[#A50044] px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-colors"
              >
                Join the Community
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