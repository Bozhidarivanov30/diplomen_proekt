"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const { registerUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await registerUser(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-maroon to-yellow">
      <div className="border-4 border-red-500 text-center p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
        <Image
          src="https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png"
          alt="Barcelona Logo"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-black mb-6">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Имейл
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Парола
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              minLength="6"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Регистрация
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Вече инаш акаунт?{" "}
          <Link href="/Login" className="text-blue-500 underline">
            Влез от тук
          </Link>
        </p>
      </div>
    </div>
  );
}