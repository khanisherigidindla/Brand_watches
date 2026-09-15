# Aurelion Fine Watches

Luxury watch e-commerce built with Next.js 14, TypeScript, Tailwind CSS, Zustand, Framer Motion, GSAP, Lenis and Three.js (R3F).

## Features
- 120+ watches with real India market prices, full spec sheets (type, metal, dial, strap, movement)
- Cart, wishlist, notifications (persisted via zustand + localStorage)
- Auth (login/register), dashboard, order tracking with printable receipts
- Checkout with **UPI (OTP + demo bank page)** and **COD** payments
- Animated dashboard: watch-frame turntable + gold video showcase

## Getting started
```bash
npm install
npm run dev
```
Open http://localhost:3000/login — no env vars required (payments run in sandbox mode).

## Deploy on Vercel
1. Push this repo to GitHub.
2. https://vercel.com/new → import the repo → Framework: **Next.js** (auto-detected).
3. Build command `npm run build`, output auto. No env vars needed.
4. Deploy — `vercel.json` and cache headers for videos/frames are already configured.

## Deploy on Netlify
1. https://app.netlify.com → Add new site → Import from GitHub.
2. `netlify.toml` is preconfigured: `@netlify/plugin-nextjs@5`, Node 20.
3. Deploy — no env vars needed.

## Deploy on AWS
- **Amplify Hosting:** connect repo, build `npm run build`, Node 20.
- **ECS/Docker or EC2:** `npm ci && npm run build && npm run start` (port 3000).

## Environment (optional)
Copy `.env.example` to `.env.local` only if wiring real Razorpay/Stripe keys — sandbox mode works without them.
