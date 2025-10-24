/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50:"#eef2ff", 100:"#e0e7ff", 600:"#4f46e5", 700:"#4338ca" },
        ink: { 400:"#6b7280", 500:"#4b5563", 700:"#374151" },
        panel: { 50:"#f7f7fb", 100:"#f3f4f6", 200:"#e5e7eb" }
      },
      borderRadius: { xl: "1rem", '2xl': "1.25rem" },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: [],
}
