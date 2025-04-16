"use client";

import { useUser } from "../context/UserContext";
import { removeFromCart } from "../firebase";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { user, cart, setCart } = useUser();
  const [stripePromise, setStripePromise] = useState(null);

  // Calculate the total price of items in the cart
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  // Load Stripe.js
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
      // Create a Checkout Session
      const response = await fetch("/api/checkout_api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart, // Pass the cart items to the backend
        }),
      });
  
      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the JSON response
      const { id } = await response.json();
  
      // Redirect to Stripe Checkout
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
    <div className="p-6">
      {cart.length === 0 ? (
        <p className="mt-4 text-lg">Количката ти е празна.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {cart.map((item, index) => (
            <div key={index} className="border p-2 rounded shadow">
              <h2 className="text-lg font-bold">{item.name}</h2>
              <Image
                src={item.imgScr}
                alt={item.name}
                width={80}
                height={80}
                className="w-full h-auto mb-4"
              />
              <p>${item.price}</p>
              <button
                onClick={() => handleRemoveFromCart(item)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Премахване от количка
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Display Total Price and Checkout Button */}
      <div className="mt-6">
        <p className="text-xl font-bold">Крайна цена: ${totalPrice.toFixed(2)}</p>
        <button
          onClick={handleCheckout}
          className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Плащане
        </button>
      </div>
    </div>
  );
}
