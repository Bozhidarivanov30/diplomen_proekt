"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { addToCart, getCart } from "../firebase";
import Image from "next/image";

export default function ShopPage() {
  const { user, setCart } = useUser();
  const [shopItems] = useState([
    {
      id: 1,
      name: "Barcelona Jersey",
      price: 80,
      imgSrc: "https://store.fcbarcelona.com/cdn/shop/files/imagen_3.jpg?v=1730388363&width=1946",
    },
    {
      id: 2,
      name: "Scarf",
      price: 20,
      imgSrc: "https://thumblr.uniid.it/product/92600/83227f8f0841.jpg?width=3840&format=webp&q=75",
    },
    {
      id: 3,
      name: "Ball",
      price: 25,
      imgSrc: "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/6525c408-fe40-4a0b-8158-d66c27990a4e/FCB+NK+STRK.png",
    },
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
      await addToCart(user, item);
      setCart((prev) => [...prev, item]);
      alert(`${item.name} added to your cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-maroon p-6 relative">
      {/* Yellow Stripes */}
      <div className="absolute top-0 left-0 w-full h-full bg-stripes pointer-events-none"></div>

      {/* Shop Content */}
      <h1 className="text-2xl font-bold text-white mb-6 relative z-10">Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {shopItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-2">{item.name}</h2>
            {/* Replace <img> with <Image /> */}
            <Image
              src={item.imgSrc}
              alt={item.name}
              width={200}
              height={200}
              className="w-full h-48 object-contain mb-4"
            />
            <p className="text-gray-700 mb-2">${item.price}</p>
            <button
              onClick={() => handleAddToCart(item)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}