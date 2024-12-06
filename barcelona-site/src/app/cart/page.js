// src/app/cart/page.js
"use client"; // Ensures this is run on the client-side

import { useUser } from "../context/UserContext"; // Ensure this import is correct
import { useRouter } from "next/navigation"; // Use next/navigation for router in App Directory
import { useEffect, useState } from "react";

export default function CartPage() {
  const { user } = useUser(); // Access user context
  const router = useRouter(); // Get the router from next/navigation
  const [isClient, setIsClient] = useState(false);
  
  const cartItems = [
    // Example cart items - replace with real cart data
    { id: 1, name: "Item 1", price: 20, quantity: 2 },
    { id: 2, name: "Item 2", price: 35, quantity: 1 }
  ];

  useEffect(() => {
    setIsClient(true); // Set to true once we're on the client
  }, []);

  if (!isClient) {
    return null; // Prevent rendering until client-side
  }

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <h1>Your Cart</h1>
      {!user ? (
        <div>
          <p>Please log in to access your cart</p>
          <button onClick={() => router.push("/login")}>Login</button> {/* Use next/navigation for navigation */}
        </div>
      ) : (
        <div>
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div>
              <ul>
                {cartItems.map(item => (
                  <li key={item.id}>
                    <p>{item.name} - ${item.price} x {item.quantity}</p>
                  </li>
                ))}
              </ul>
              <p>Total: ${totalPrice}</p>
              <button onClick={() => router.push("/checkout")}>Checkout</button> {/* Navigate to checkout page */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
