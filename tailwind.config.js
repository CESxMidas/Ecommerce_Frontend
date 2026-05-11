/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        dark: "#0B1220",
        card: "#111827",
        accent: "#22C55E",
      },
    },
  },
  plugins: [],
};
