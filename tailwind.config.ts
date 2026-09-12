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
        iqra: {
          navy: {
            950: "#050e1d",
            900: "#0a192f",
            850: "#0c1f3a",
            800: "#0f274a",
            700: "#163866",
            600: "#1e4d8c",
          },
          blue: {
            50: "#eff8ff",
            100: "#dbeefe",
            200: "#bfe3fe",
            300: "#93d2fd",
            400: "#60b7fa",
            500: "#3b98f5",
            600: "#0066cc",
            700: "#0284c7",
            800: "#075985",
            900: "#0c4a6e",
          },
          gold: {
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-subtle": "0 4px 20px 0 rgba(0, 0, 0, 0.2)",
        "card-soft": "0 20px 50px -12px rgba(10, 25, 47, 0.12)",
        "card-hover": "0 25px 60px -10px rgba(10, 25, 47, 0.18)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
