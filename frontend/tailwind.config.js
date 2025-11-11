/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#fff7e6",
        brown: "#a0522d",
        peach: "#ffd4b8",
        softPink: "#fce7f3",
        mint: "#a7f3d0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        cute: ["'Comic Neue'", "cursive"],
      },
    },
  },
  plugins: [],
};
