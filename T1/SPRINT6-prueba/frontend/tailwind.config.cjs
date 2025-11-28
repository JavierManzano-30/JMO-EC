/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0ea5e9",
        accent: "#8b5cf6",
        surface: "#0b1222",
      },
    },
  },
  plugins: [],
};
