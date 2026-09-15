/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  images: {
    // Allow the Next Image optimizer to serve any host (Vercel/Netlify/AWS safe).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    // Serve originals directly (unoptimized) — guarantees every watch photo,
    // turntable frame and webp/avif/jpg renders on all hosts without
    // optimizer edge-cases (50 frame turntables, large mp4 posters, etc.).
    unoptimized: true,
  },
  // Large static assets (mp4 videos, 50 jpg frames) must not be transformed.
  headers: async () => [
    {
      source: "/assets/video/:path*",
      headers: [
        { key: "Accept-Ranges", value: "bytes" },
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/watch-frames/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
    {
      source: "/limited-editions/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
  ],
  // Never fail `next build` on hosting because of lint warnings.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;

