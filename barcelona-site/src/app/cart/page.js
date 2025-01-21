"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getCart, removeFromCart } from "../firebase";

export default function CartPage() {
  const { user, cart, setCart } = useUser();

  useEffect(() => {
    async function fetchCart() {
      if (user) {
        const userCart = await getCart(user);
        setCart(userCart);
      }
    }
    fetchCart();
  }, [user, setCart]); 

  const handleRemoveFromCart = async (item) => {
    try {
      await removeFromCart(user, item);
      setCart((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
      alert(`${item.name} removed from your cart.`);
    } catch (error) {
      console.error("Failed to remove from cart:", error.message);
    }
  };

  if (!user) {
    return <p>You need to log in to view your cart.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="mt-4">
          {cart.map((item, index) => (
            <div
              key={index}  
              className="flex justify-between items-center border p-4 rounded shadow mb-2"
            >
              <div>
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p>${item.price}</p>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
