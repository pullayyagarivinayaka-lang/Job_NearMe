import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#b8d0ff",
          300: "#8bb0ff",
          400: "#5c8bff",
          500: "#3366ff", // primary
          600: "#254edb",
          700: "#1c3cae",
          800: "#182f85",
          900: "#152762",
          950: "#0c1638",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          400: "#7d8598",
          600: "#4a5268",
          800: "#242b3d",
          900: "#141826",
          950: "#0a0c14",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
