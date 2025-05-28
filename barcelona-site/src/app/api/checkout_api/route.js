import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { items, userId } = await request.json();

    // Create line items for Stripe Checkout
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.imgScr], // Add product image if available
        },
        unit_amount: item.price, // Price already in cents from frontend
      },
      quantity: item.quantity || 1,
    }));

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        userId: userId || "guest",
        productIds: items.map(item => item.id).join(","),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'], // Adjust based on your shipping locations
      },
    });

    return new Response(JSON.stringify({ id: session.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.type || "Unknown error" 
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}