"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { loginUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    await loginUser(email, password); // loginUser will handle redirection (admin or regular)
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
        <h2 className="text-2xl font-bold text-black mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Имейл
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Парола
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
          >
            Вход
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Нямаш акаунт{" "}
          <Link href="/Register" className="text-blue-500 underline">
            Регистрирай се
          </Link>
        </p>
      </div>
    </div>
  );
}
