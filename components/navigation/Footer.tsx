import Link from "next/link";

const shopLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/watches", label: "All Watches" },
  { href: "/limited-editions", label: "Limited Editions" },
  { href: "/budget-friendly", label: "Budget-Friendly" },
];

const companyLinks = [
  { href: "/about", label: "About Aurelion" },
  { href: "/budget-friendly", label: "Budget-Friendly" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard", label: "Client Account" },
];

export const Footer = () => {
  return (
    <footer className="bg-ink-950 text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex flex-col leading-none">
            <span className="font-serif text-xl tracking-[0.22em] font-bold">AURELION</span>
            <span className="text-[10px] tracking-[0.3em] text-brand-gold uppercase mt-1">
              Fine Watches
            </span>
          </div>
          <p className="text-sm text-white/70 max-w-xs leading-relaxed">
            The world&apos;s finest watches with transparent, real market prices. Rolex, Patek
            Philippe, Omega, Cartier and more.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold mb-4">Shop</h3>
          <ul className="space-y-3">
            {shopLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-white/80 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold mb-4">The Maison</h3>
          <ul className="space-y-3">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-white/80 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold mb-4">Assurance</h3>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 leading-relaxed">
            5-year warranty · Authenticity certificate · Insured delivery across India.
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} AURELION Fine Watches. All rights reserved.
          </p>
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/50">
            Mumbai · Delhi · Dubai
          </p>
        </div>
      </div>
    </footer>
  );
};
