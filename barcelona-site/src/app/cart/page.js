"use client";

import { useUser } from "../context/UserContext";
import { removeFromCart } from "../firebase";
import Image from "next/image";

export default function CartPage() {
  const { user, cart, setCart } = useUser();

  const handleRemoveFromCart = async (item) => {
    if (!user) {
      alert("You need to be logged in to remove items from your cart.");
      return;
    }
    try {
      await removeFromCart(user, item);
      setCart((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
      alert(`${item.name} removed from your cart!`);
    } catch (error) {
      console.error("Failed to remove from cart:", error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="mt-4 text-lg">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {cart.map((item, index) => (
            <div key={index} className="border p-2 rounded shadow">
              <h2 className="text-lg font-bold">{item.name}</h2>
              {/* Image with updated size */}
              <Image
                src={item.imgSrc}
                alt={item.name}
                width={80}  // Reduced size to match shop
                height={80} // Reduced size to match shop
                className="w-full h-auto mb-4"
              />
              <p>${item.price}</p>
              <button
                onClick={() => handleRemoveFromCart(item)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Remove from Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add the "Go to Checkout" Button */}
      <div className="mt-6">
        <button
          onClick={() => alert("Redirecting to Stripe Checkout...")}
          className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Go to Checkout
        </button>
      </div>
    </div>
  );
}
