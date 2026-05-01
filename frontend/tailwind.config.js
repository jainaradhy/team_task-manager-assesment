import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f7ff",
          100: "#d9e9ff",
          200: "#b6d4ff",
          300: "#84b6ff",
          400: "#4d90ff",
          500: "#1d6fff",
          600: "#0b53db",
          700: "#1142aa",
          800: "#173a85",
          900: "#1b356d",
        },
        accent: {
          500: "#ff7a18",
          600: "#e86509",
        },
      },
      boxShadow: {
        soft: "0 18px 60px rgba(15, 23, 42, 0.14)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(29,111,255,0.18), transparent 32%), radial-gradient(circle at 80% 20%, rgba(255,122,24,0.16), transparent 25%), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(244,247,251,0.94))",
        "hero-grid-dark":
          "radial-gradient(circle at top left, rgba(29,111,255,0.22), transparent 30%), radial-gradient(circle at 80% 20%, rgba(255,122,24,0.18), transparent 25%), linear-gradient(180deg, rgba(2,6,23,0.97), rgba(15,23,42,0.96))",
      },
      fontFamily: {
        sans: ["'Manrope'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        fadeUp: "fadeUp 0.55s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [forms],
};
