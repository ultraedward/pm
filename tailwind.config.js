/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
      colors: {
        surface: "var(--surface)",
      },
    },
  },
  plugins: [],
};
