"use client";

import React, { Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Printer, Eye, ArrowRight } from "lucide-react";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { getLocalOrders } from "@/lib/supabase/mockStore";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const paymentMethod = searchParams.get("paymentMethod") || "RAZORPAY";
  const receiptRef = useRef<HTMLDivElement>(null);

  const orders = getLocalOrders();
  const order =
    orders.find((o) => o.id === orderId || o.orderNumber === orderNumber) ||
    orders[orders.length - 1];

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(
      `<!DOCTYPE html><html><head><title>Receipt</title><style>body{font-family:Georgia,serif;padding:40px;color:#1a1a1a}.receipt{max-width:800px;margin:0 auto;border:2px solid #D4AF37;padding:40px}.header{text-align:center;border-bottom:2px solid #D4AF37;padding-bottom:20px;margin-bottom:30px}.brand{font-size:28px;font-weight:bold;letter-spacing:8px}.subtitle{font-size:12px;color:#666;letter-spacing:3px;margin-top:5px}.section{margin-bottom:25px}.section-title{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#D4AF37;margin-bottom:10px;font-weight:bold}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee}.label{font-size:13px;color:#666}.value{font-size:13px;color:#1a1a1a;font-weight:500}.total-row{display:flex;justify-content:space-between;padding:15px 0;border-top:2px solid #D4AF37;margin-top:10px}.total-label{font-size:16px;font-weight:bold;text-transform:uppercase;letter-spacing:2px}.total-value{font-size:20px;font-weight:bold;color:#D4AF37}.item{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee}.footer{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #eee}.footer-text{font-size:11px;color:#999}.badge{display:inline-block;padding:5px 15px;background:#d4af37;color:#fff;font-size:11px;letter-spacing:2px;margin-top:10px}@media print{body{padding:0}.receipt{border:none}}</style></head><body><div class="receipt"><div class="header"><div class="brand">AURELION</div><div class="subtitle">LUXURY TIMEPIECES</div><div class="badge">PAYMENT RECEIPT</div></div><div class="section"><div class="section-title">Order Details</div><div class="row"><span class="label">Order Number:</span><span class="value">${order?.orderNumber || "N/A"}</span></div><div class="row"><span class="label">Order Date:</span><span class="value">${order ? new Date(order.createdAt).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "N/A"}</span></div><div class="row"><span class="label">Payment Method:</span><span class="value">${paymentMethod}</span></div><div class="row"><span class="label">Payment Status:</span><span class="value" style="color:#10b981">CONFIRMED</span></div><div class="row"><span class="label">Tracking Number:</span><span class="value">${order?.trackingNumber || "N/A"}</span></div></div><div class="section"><div class="section-title">Customer Details</div><div class="row"><span class="label">Name:</span><span class="value">${order?.customerName || "N/A"}</span></div><div class="row"><span class="label">Email:</span><span class="value">${order?.email || "N/A"}</span></div><div class="row"><span class="label">Phone:</span><span class="value">${order?.phone || "N/A"}</span></div></div><div class="section"><div class="section-title">Items</div>${order?.items.map((item) => `<div class="item"><span>${item.productName} (×${item.quantity})</span><span>₹${(item.priceINR * item.quantity).toLocaleString("en-IN")}</span></div>`).join("") || ""}</div><div class="section"><div class="row"><span class="label">Subtotal:</span><span class="value">₹${(order?.subtotalINR || 0).toLocaleString("en-IN")}</span></div><div class="row"><span class="label">GST (18%):</span><span class="value">₹${(order?.taxINR || 0).toLocaleString("en-IN")}</span></div><div class="row"><span class="label">Shipping:</span><span class="value" style="color:#10b981">Complimentary</span></div><div class="total-row"><span class="total-label">Total Paid:</span><span class="total-value">₹${(order?.totalINR || 0).toLocaleString("en-IN")}</span></div></div><div class="footer"><p class="footer-text">Thank you for your acquisition. Registered in the Geneva Archives.</p><p class="footer-text" style="margin-top:10px">concierge@aurelion.com | +91 22 1234 5678</p></div></div></body></html>`,
    );
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-emerald-950 py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 rounded-full border-4 border-emerald-300/70 bg-emerald-400/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(52,211,153,0.25)]">
            <CheckCircle2 className="w-12 h-12 text-emerald-300" />
          </div>
          <span className="text-[10px] font-mono tracking-super-wide uppercase text-emerald-300">
            Payment Confirmed
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-white">
            Payment Successful
          </h1>
          <p className="text-sm text-emerald-100/80 max-w-md mx-auto">
            Your payment has been processed successfully. A receipt has been
            generated for your records.
          </p>
        </div>

        <div
          ref={receiptRef}
          className="bg-white rounded-lg p-8 text-ink-950 space-y-6"
        >
          <div className="text-center border-b-2 border-gold pb-4">
            <h2 className="text-2xl font-serif tracking-widest font-bold">
              AURELION
            </h2>
            <p className="text-[10px] text-ink-500 tracking-[3px] uppercase mt-1">
              Luxury Timepieces
            </p>
            <span className="inline-block mt-3 px-4 py-1 bg-gold text-white text-[10px] tracking-[2px] uppercase">
              Payment Receipt
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-[10px] uppercase tracking-[2px] text-gold font-bold mb-2">
                Order Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-ink-100">
                  <span className="text-sm text-ink-500">Order Number:</span>
                  <span className="text-sm font-medium">
                    {order?.orderNumber || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-ink-100">
                  <span className="text-sm text-ink-500">Order Date:</span>
                  <span className="text-sm font-medium">
                    {order
                      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-ink-100">
                  <span className="text-sm text-ink-500">Payment Method:</span>
                  <span className="text-sm font-medium">{paymentMethod}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-ink-100">
                  <span className="text-sm text-ink-500">Payment Status:</span>
                  <span className="text-sm font-medium text-emerald-600">
                    CONFIRMED
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-ink-100">
                  <span className="text-sm text-ink-500">Tracking Number:</span>
                  <span className="text-sm font-medium">
                    {order?.trackingNumber || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] uppercase tracking-[2px] text-gold font-bold mb-2">
                Customer Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-ink-100">
                  <span className="text-sm text-ink-500">Name:</span>
                  <span className="text-sm font-medium">
                    {order?.customerName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-ink-100">
                  <span className="text-sm text-ink-500">Email:</span>
                  <span className="text-sm font-medium">
                    {order?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-ink-100">
                  <span className="text-sm text-ink-500">Phone:</span>
                  <span className="text-sm font-medium">
                    {order?.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] uppercase tracking-[2px] text-gold font-bold mb-2">
                Items
              </h3>
              <div className="space-y-2">
                {order?.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 border-b border-ink-100"
                  >
                    <span className="text-sm">
                      {item.productName} (x{item.quantity})
                    </span>
                    <span className="text-sm font-medium">
                      {(item.priceINR * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                )) || <div className="py-2 text-sm text-ink-500">No items</div>}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between py-2 border-b border-ink-100">
                <span className="text-sm text-ink-500">Subtotal:</span>
                <span className="text-sm font-medium">
                  {(order?.subtotalINR || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-ink-100">
                <span className="text-sm text-ink-500">GST (18%):</span>
                <span className="text-sm font-medium">
                  {(order?.taxINR || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-ink-100">
                <span className="text-sm text-ink-500">Shipping:</span>
                <span className="text-sm font-medium text-emerald-600">
                  Complimentary
                </span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gold mt-2">
                <span className="text-base font-bold uppercase tracking-[2px]">
                  Total Paid:
                </span>
                <span className="text-xl font-bold text-gold">
                  {(order?.totalINR || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-ink-100">
            <p className="text-[11px] text-ink-400">
              Thank you for your acquisition. Your timepiece is registered in
              the Geneva Archives.
            </p>
            <p className="text-[10px] text-ink-400 mt-2">
              For inquiries: concierge@aurelion.com | +91 22 1234 5678
            </p>
            <p className="text-[10px] text-ink-300 mt-2">
              This is a computer-generated receipt and does not require a
              signature.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <LuxuryButton
            variant="gold"
            size="lg"
            onClick={handlePrint}
            icon={<Printer className="w-4 h-4" />}
          >
            Print Receipt
          </LuxuryButton>
          <Link href={order ? `/dashboard/orders/${order.id}` : "/dashboard"}>
            <LuxuryButton
              variant="outline"
              size="lg"
              icon={<Eye className="w-4 h-4" />}
            >
              Track Order
            </LuxuryButton>
          </Link>
          <Link href="/watches">
            <LuxuryButton
              variant="outline"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue Shopping
            </LuxuryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
          <div className="text-gold font-mono">Loading...</div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
