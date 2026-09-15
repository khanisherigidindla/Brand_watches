import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerEmail, successUrl, cancelUrl } = body;

    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey || secretKey.startsWith("sk_test_placeholder")) {
      // Return simulated success response if secret key is missing or placeholder
      // FIXED: Redirect to payment-success instead of order-success
      return NextResponse.json({
        url: `${successUrl || "http://localhost:3000/payment-success"}?session_id=mock_stripe_session_${Date.now()}&paymentMethod=STRIPE`,
        isSimulated: true,
      });
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
    });

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.name,
          images: item.product.images?.length ? [item.product.images[0]] : [],
          description: item.product.reference || "",
        },
        unit_amount: Math.round(item.product.priceINR * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create Stripe checkout session" },
      { status: 500 }
    );
  }
}
