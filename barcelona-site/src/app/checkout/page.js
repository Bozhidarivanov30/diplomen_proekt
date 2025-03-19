"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    // Load Stripe.js
    const initializeStripe = async () => {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      setStripePromise(stripe);
    };

    initializeStripe();
  }, []);

  const handleCheckout = async () => {
    try {
      // Create a Checkout Session
      const response = await fetch("/api/checkout_api", {
        method: "POST",
      });

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
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="mb-6">Test Product - $20.00</p>
        <button
          onClick={handleCheckout}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}