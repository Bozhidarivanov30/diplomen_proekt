"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { addToCart, getCart, getProducts } from "../firebase";
import Image from "next/image";

export default function ShopPage() {
  const { user, setCart } = useUser();
  const [shopItems, setShopItems] = useState([]); // State to store products from Firebase
  const [loading, setLoading] = useState(true); // State to handle loading state

  // Fetch products from Firebase on component mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getProducts();
        setShopItems(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Fetch user's cart on user change
  useEffect(() => {
    async function fetchCart() {
      if (user?.uid) { // Check if user.uid is defined
        const userCart = await getCart(user.uid);
        setCart(userCart);
      }
    }
    fetchCart();
  }, [user, setCart]);

  // Handle adding items to cart
  const handleAddToCart = async (item) => {
    if (!user?.uid) { // Check if user.uid is defined
      alert("You need to be logged in to add items to your cart.");
      return;
    }
    try {
      await addToCart(user.uid, item);
      setCart((prev) => [...prev, item]);
      alert(`${item.name} added to your cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error.message);
    }
  };

  // Display loading state while fetching products
  if (loading) {
    return <div className="min-h-screen bg-maroon p-6 text-white">Loading...</div>;
  }

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
            <Image
              src={item.imgScr}
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