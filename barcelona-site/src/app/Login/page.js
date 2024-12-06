"use client";

import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    login(email.split('@')[0]); // Extract username
    router.push('/'); // Redirect to homepage
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-lg space-y-4"
      >
        <h1 className="text-lg font-bold text-center">Log In</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

