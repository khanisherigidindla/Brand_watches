import crypto from "crypto";

export interface CreateOrderParams {
  amountINR: number;
  receiptId: string;
  notes?: Record<string, string>;
}

export interface VerifySignatureParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
}: VerifySignatureParams): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_luxury_secret";
  if (!secret) return false;

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === razorpaySignature;
}
