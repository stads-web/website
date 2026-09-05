import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#F4F6FA",
          100: "#E7ECF4",
          200: "#CBD6E7",
          300: "#A8B7D1",
          400: "#8A9DBE",
          500: "#7388B0",
          600: "#5A6E97",
          800: "#203765",
          900: "#16294A",
          950: "#0F1D36",
        },
      },
      fontFamily: {
        sans: ["var(--font-libre-franklin)", "system-ui", "sans-serif"],
        heading: ["var(--font-inter)", "system-ui", "sans-serif"],
        accent: ["var(--font-playfair)", "serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 29, 54, 0.06), 0 8px 24px rgba(15, 29, 54, 0.08)",
      },
      keyframes: {
        "drift-a": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(6%, 8%, 0) scale(1.12)" },
        },
        "drift-b": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1.08)" },
          "50%": { transform: "translate3d(-7%, -6%, 0) scale(1)" },
        },
        "drift-c": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(9%, -5%, 0) scale(1.1)" },
        },
        blink: {
          "0%, 60%": { opacity: "1" },
          "65%, 95%": { opacity: "0.5" },
          "100%": { opacity: "1" },
        },
        marquee: {
          from: { transform: "translate3d(0, 0, 0)" },
          to: { transform: "translate3d(-50%, 0, 0)" },
        },
      },
      animation: {
        "drift-a": "drift-a 26s ease-in-out infinite",
        "drift-b": "drift-b 32s ease-in-out infinite",
        "drift-c": "drift-c 38s ease-in-out infinite",
        blink: "blink 1.6s steps(1, end) infinite",
        marquee: "marquee 38s linear infinite",
        "spin-slow": "spin 9s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
