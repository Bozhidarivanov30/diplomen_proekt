"use client";

import { useUser } from "../context/UserContext";
import { removeFromCart } from "../firebase";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { user, cart, setCart } = useUser();
  const [stripePromise, setStripePromise] = useState(null);

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  useEffect(() => {
    const initializeStripe = async () => {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      setStripePromise(stripe);
    };
    initializeStripe();
  }, []);

  const handleRemoveFromCart = async (item) => {
    if (!user?.uid) {
      alert("You need to be logged in to remove items from your cart.");
      return;
    }
    try {
      await removeFromCart(user.uid, item);
      setCart((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
      alert(`${item.name} removed from your cart!`);
    } catch (error) {
      console.error("Failed to remove from cart:", error.message);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add items to proceed to checkout.");
      return;
    }
  
    try {
      const response = await fetch("/api/checkout_api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const { id } = await response.json();
      const { error } = await stripePromise.redirectToCheckout({
        sessionId: id,
      });
  
      if (error) {
        console.error("Checkout error:", error);
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Вашата количка</h1>
      
      {cart.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl">Количката е празна.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col h-full transition-transform hover:scale-[1.02]">
                <div className="relative w-full h-64 md:h-80 mb-6">
                  <Image
                    src={item.imgScr}
                    alt={item.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority
                  />
                </div>
                
                <div className="flex-grow">
                  <h2 className="text-xl md:text-2xl font-bold mb-3">{item.name}</h2>
                  <p className="text-lg md:text-xl text-gray-700 mb-6">${item.price.toFixed(2)}</p>
                </div>
                
                <button
                  onClick={() => handleRemoveFromCart(item)}
                  className="mt-auto px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full text-lg"
                >
                  Премахване
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-2xl md:text-3xl font-bold">
                Обща сума: <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
              </p>
              <button
                onClick={handleCheckout}
                disabled={!stripePromise}
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xl font-bold transition-colors disabled:bg-gray-400 w-full md:w-auto"
              >
                Продължи към плащане →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}