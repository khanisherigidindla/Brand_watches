"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from "lucide-react";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Private Client Enquiry",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const key = "aurelion_enquiries";
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({ ...form, id: `enq_${Date.now()}`, createdAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(list));
    } catch {
      // ignore storage errors
    }
    setSent(true);
  };

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 bg-obsidian-950 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: concierge info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-super-wide uppercase text-gold">
              Private Client Concierge
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide">
              CONTACT THE MAISON
            </h1>
            <p className="text-xs md:text-sm text-silver-dark leading-relaxed">
              Our Geneva-based horological concierge remains at your service around the
              clock for acquisitions, bespoke commissions and after-sales care.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-4 text-xs">
              <div className="w-10 h-10 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center text-gold">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-silver-dark font-mono">Email</p>
                <p className="text-white font-serif">concierge@aurelion.luxury</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="w-10 h-10 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center text-gold">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-silver-dark font-mono">Concierge Line</p>
                <p className="text-white font-serif">+41 22 000 1928</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="w-10 h-10 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center text-gold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-silver-dark font-mono">Atelier</p>
                <p className="text-white font-serif">Rue du Rhône 19, Genève, Suisse</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="w-10 h-10 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center text-gold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-silver-dark font-mono">Availability</p>
                <p className="text-white font-serif">24 / 7 by appointment</p>
              </div>
            </div>
          </div>
        </div>
        {/* Right: form */}
        <div className="lg:col-span-7">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 bg-obsidian-900/50 border border-gold/30 rounded-sm p-12 min-h-[400px]">
              <div className="w-16 h-16 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center text-gold">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif text-white">ENQUIRY RECEIVED</h2>
              <p className="text-xs text-silver-dark max-w-sm">
                Our concierge will respond to <strong className="text-gold">{form.email || "your enquiry"}</strong> within one business day.
              </p>
              <Link href="/watches">
                <LuxuryButton variant="outline" size="sm">Continue Browsing</LuxuryButton>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-obsidian-900/50 border border-white/10 rounded-sm p-8 space-y-5">
              <div>
                <h2 className="font-serif text-xl text-white">WRITE TO US</h2>
                <p className="text-xs text-silver-dark mt-1">Fields marked * are required.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  required
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-obsidian-950/80 border border-white/15 focus:border-gold/60 rounded px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none"
                />
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="Email Address *"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-obsidian-950/80 border border-white/15 focus:border-gold/60 rounded px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none"
                />
              </div>

              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full bg-obsidian-950/80 border border-white/15 focus:border-gold/60 rounded px-4 py-3 text-sm text-white outline-none"
              >
                <option>Private Client Enquiry</option>
                <option>Bespoke Commission</option>
                <option>Acquisition & Checkout Support</option>
                <option>After-Sales / Warranty</option>
                <option>Press & Partnerships</option>
              </select>

              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell us about your acquisition ambition... *"
                value={form.message}
                onChange={handleChange}
                className="w-full bg-obsidian-950/80 border border-white/15 focus:border-gold/60 rounded px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none resize-none"
              />

              <div className="pt-2 flex justify-end">
                <LuxuryButton type="submit" variant="gold" size="md" icon={<Send className="w-4 h-4" />}>
                  Send Enquiry
                </LuxuryButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}