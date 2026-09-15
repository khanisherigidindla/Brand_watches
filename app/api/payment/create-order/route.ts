import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amountINR, receiptId, notes } = body;

    if (!amountINR || amountINR <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // If Razorpay keys are supplied, try to use the SDK
    if (key_id && key_secret && !key_id.includes("placeholder")) {
      try {
        const instance = new Razorpay({
          key_id,
          key_secret,
        });

        const order = await instance.orders.create({
          amount: Math.round(amountINR * 100), // convert to paise
          currency: "INR",
          receipt: receiptId || `rec_${Date.now()}`,
          notes: notes || {},
        });

        return NextResponse.json({
          id: order.id,
          currency: order.currency,
          amount: order.amount,
          mode: "razorpay_sdk"
        });
      } catch (sdkError) {
        // SDK failed (e.g., invalid keys) - fall through to sandbox simulator
        console.warn("Razorpay SDK failed, using sandbox simulator:", (sdkError as Error).message);
      }
    }

    // Sandbox simulator fallback for local dev / testing
    const mockOrderId = `order_aur_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return NextResponse.json({
      id: mockOrderId,
      currency: "INR",
      amount: Math.round(amountINR * 100),
      mode: "sandbox_simulator"
    });
  } catch (error: unknown) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create order" },
      { status: 500 }
    );
  }
}
