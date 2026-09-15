import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, BadgeCheck, Building2, Gem, HeartHandshake, ShieldCheck, Truck } from "lucide-react";

export const metadata = {
  title: "About Aura | Brand Watches at Honest Prices",
  description: "Aura is India's trusted destination for authentic luxury and budget-friendly watches with real market prices.",
};

const values = [
  { icon: <BadgeCheck className="w-5 h-5" />, title: "100% Authentic", body: "Verified by certified horologists with box, papers and a 12-point inspection." },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Real Market Prices", body: "Live India market levels — transparent, updated, no dummy MRPs." },
  { icon: <Truck className="w-5 h-5" />, title: "Insured Delivery", body: "Insured signature-on-delivery shipping across India in secure packaging." },
  { icon: <HeartHandshake className="w-5 h-5" />, title: "5-Year Promise", body: "5-year warranty plus 7-day easy returns on every timepiece." },
];

const stats = [
  { value: "38+", label: "Luxury references" },
  { value: "60", label: "Studio panels" },
  { value: "60", label: "Budget picks" },
  { value: "100%", label: "Authenticity checked" },
];
export default function AboutPage() {
  return (
    <div className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#b9975b]">About Aura</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">India&apos;s honest home for brand watches.</h1>
            <p className="mt-4 text-slate-500 leading-relaxed max-w-xl">From a Rs 3,499 Sonata to a Rs 2.85-crore Patek Philippe Nautilus — every watch shows its exact photograph, full name and real market price.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/watches" className="inline-flex items-center gap-2 bg-[#0e3a5d] text-white text-sm font-bold rounded-lg px-6 py-3">Browse all watches <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/budget-friendly" className="inline-flex items-center gap-2 text-sm font-bold text-[#0e3a5d] border border-slate-300 rounded-lg px-6 py-3">Budget-friendly picks</Link>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                  <p className="text-xl font-extrabold text-[#0e3a5d]">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              <Image src="/limited-editions/rolex1.webp" alt="Rolex Submariner" fill className="object-contain p-6" />
            </div>
            <div className="relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 mt-8">
              <Image src="/limited-editions/pic10.jpeg" alt="Rolex Datejust" fill className="object-contain p-6" />
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#b9975b]">Our story</p>
        <h2 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">Built because watch buying felt broken.</h2>
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6 text-[15px] text-slate-600 leading-relaxed">
          <p>Aura started in Mumbai with one frustration: watch prices in India were a maze of inflated MRPs and stock photos that never matched the real piece. So we built the store we wished existed — each listing carries the exact photograph, full reference name, and the real street price.</p>
          <p>Today we curate 38 luxury references — Rolex, Patek Philippe, Omega, Cartier and more — alongside 34 budget-friendly picks from Seiko, Citizen, Casio, Titan and Timex, each illustrated with real studio artwork from our own catalogue. Every order is checked, insured and backed for five years.</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">What we promise</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v) => (
            <div key={v.title} className="border border-slate-200 rounded-2xl p-6 bg-white">
              <div className="w-11 h-11 rounded-xl bg-[#0e3a5d] text-white flex items-center justify-center">{v.icon}</div>
              <h3 className="mt-4 font-bold text-lg">{v.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border border-slate-200 rounded-2xl bg-white p-6">
            <div className="w-11 h-11 rounded-xl bg-[#b9975b] text-white flex items-center justify-center"><Building2 className="w-5 h-5" /></div>
            <h3 className="mt-4 font-bold text-lg">Visit the salon</h3>
            <p className="mt-2 text-sm text-slate-500">Bandra West, Mumbai · Mon-Sat, 10am-8pm. Try any reference in person.</p>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0e3a5d]">Contact us <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="border border-slate-200 rounded-2xl bg-white p-6">
            <div className="w-11 h-11 rounded-xl bg-[#0e3a5d] text-white flex items-center justify-center"><Gem className="w-5 h-5" /></div>
            <h3 className="mt-4 font-bold text-lg">Collector sourcing</h3>
            <p className="mt-2 text-sm text-slate-500">Hunting a Nautilus, Royal Oak or Daytona? We source box-and-papers pieces.</p>
            <Link href="/limited-editions" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0e3a5d]">Limited editions <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="border border-slate-200 rounded-2xl bg-white p-6">
            <div className="w-11 h-11 rounded-xl bg-[#0e3a5d] text-white flex items-center justify-center"><Award className="w-5 h-5" /></div>
            <h3 className="mt-4 font-bold text-lg">Start small, dream big</h3>
            <p className="mt-2 text-sm text-slate-500">New to watches? Budget picks start under Rs 5,000 with the same guarantees.</p>
            <Link href="/budget-friendly" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0e3a5d]">Budget picks <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">From the collection</h2>
        <p className="mt-2 text-sm text-slate-500">Real photographs from our own catalogue.</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { src: "/limited-editions/images4.jpeg", alt: "Patek Philippe Nautilus" },
            { src: "/limited-editions/images5.jpeg", alt: "Audemars Piguet Royal Oak" },
            { src: "/assets/intro/frame-001.jpg", alt: "Aura studio frame" },
            { src: "/assets/intro/media_1788505911678.jpg", alt: "Aura showcase" },
          ].map((g) => (
            <div key={g.src} className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              <Image src={g.src} alt={g.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
