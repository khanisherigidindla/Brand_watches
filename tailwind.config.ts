import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#040405",
          900: "#08080a",
          850: "#0d0e12",
          800: "#13141a",
          700: "#1c1e26",
          600: "#272a36",
        },
        gold: {
          light: "#faeed1",
          champagne: "#e6c994",
          DEFAULT: "#d4af37",
          dark: "#aa8624",
          burnished: "#846517",
        },
        silver: {
          light: "#f8fafc",
          DEFAULT: "#e2e8f0",
          dark: "#94a3b8",
        },
        emerald: {
          glow: "#10b981",
          deep: "#052e1f",
          dark: "#021c13",
        },
        ink: {
          950: "#0b1220",
          900: "#111a2e",
          700: "#24334f",
          500: "#4a5b7a",
          400: "#6b7d9c",
        },
        paper: {
          DEFAULT: "#ffffff",
          soft: "#f6f7f9",
          line: "#e6e9ef",
        },
        brand: {
          DEFAULT: "#0e3a5d",
          deep: "#0a2a44",
          gold: "#b9975b",
          golddeep: "#96733a",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(11, 18, 32, 0.18)",
        frame: "0 30px 80px -30px rgba(11, 18, 32, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;

