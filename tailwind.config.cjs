/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#5b3df5",
          dark: "#111827",
          soft: "#f5f4ff"
        }
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "button-glow": "0 10px 30px rgba(91, 61, 245, 0.4)"
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem"
      }
    }
  },
  plugins: []
};
