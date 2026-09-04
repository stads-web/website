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
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
