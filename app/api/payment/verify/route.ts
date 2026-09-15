import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, isSandbox, isTestMode } = body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json(
        { verified: false, error: "Missing required payment identifiers" },
        { status: 400 }
      );
    }

    // Sandbox/test mode verification - accept without cryptographic signature
    if (isSandbox || isTestMode) {
      return NextResponse.json({
        verified: true,
        message: "Test mode payment verified successfully",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        mode: "test"
      });
    }

    // Live mode - verify cryptographic signature
    if (!razorpaySignature) {
      return NextResponse.json(
        { verified: false, error: "Missing payment signature for live verification" },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    if (!isValid) {
      return NextResponse.json(
        { verified: false, error: "Invalid payment cryptographic signature" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      mode: "live"
    });
  } catch (error: unknown) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { verified: false, error: (error as Error).message || "Verification failed" },
      { status: 500 }
    );
  }
}
