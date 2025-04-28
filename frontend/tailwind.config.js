/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10B981", // green-500 for profits
        accent: "#F59E0B", // amber-500 for highlights
      },
    },
  },
  plugins: [],
};
