/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#2563eb" // blue-600
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px"
      },
      boxShadow: {
        soft: "0 6px 24px rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: []
};
