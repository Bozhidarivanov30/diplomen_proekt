"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { addToCart, getCart } from "../firebase";

export default function ShopPage() {
  const { user, setCart } = useUser();
  const [shopItems] = useState([
    { id: 1, name: "Barcelona Jersey", price: 80 },
    { id: 2, name: "Scarf", price: 20 },
    { id: 3, name: "Cap", price: 25 },
  ]);

  useEffect(() => {
    async function fetchCart() {
      if (user) {
        const userCart = await getCart(user);
        setCart(userCart);
      }
    }
    fetchCart();
  }, [user, setCart]);

  const handleAddToCart = async (item) => {
    if (!user) {
      alert("You need to be logged in to add items to your cart.");
      return;
    }
    try {
      // Ensure item is a valid object
      if (typeof item !== 'object' || item === null) {
        throw new Error('Invalid item format');
      }

      await addToCart(user, item);
      setCart((prev) => [...prev, item]);
      alert(`${item.name} added to your cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {shopItems.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-bold">{item.name}</h2>
            <p>${item.price}</p>
            <button
              onClick={() => handleAddToCart(item)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
