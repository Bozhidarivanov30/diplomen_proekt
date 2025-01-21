"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";

export default function RegisterPage() {
  const { registerUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    await registerUser(email, password);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(to right, maroon 50%, yellow 50%)' }}>
      <div style={{ border: '3px solid red', textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png" alt="Barcelona Logo" style={{ width: '100px', display: 'block', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>Register</h2>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Email</label>
            <input
              type="email"
              id="email"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem', focusOutline: 'none', focusRing: '2px solid green' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Password</label>
            <input
              type="password"
              id="password"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem', focusOutline: 'none', focusRing: '2px solid green' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            style={{ width: '100%', padding: '0.5rem', backgroundColor: 'blue', color: 'white', borderRadius: '0.25rem', fontWeight: 'bold', cursor: 'pointer', hoverBackgroundColor: 'darkgreen' }}
          >
            Register
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'gray' }}>
          Already have an account? <a href="/Login" style={{ color: 'blue', textDecoration: 'underline' }}>Login here</a>
        </p>
      </div>
    </div>
  );
}
