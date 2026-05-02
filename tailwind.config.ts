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
        background: "#0B0B0B",
        foreground: "#F8FAFC",
        card: "#111111",
        accent: {
          indigo: "#6366F1",
          purple: "#A855F7",
          green: "#10B981",
          blue: "#3B82F6",
        },
        brand: {
          primary: "#6366F1",
          secondary: "#4F46E5",
          dark: "#0F172A",
          surface: "#1E293B",
        }
      },
      fontFamily: {
        heading: ["var(--font-plus-jakarta)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
export default config;
