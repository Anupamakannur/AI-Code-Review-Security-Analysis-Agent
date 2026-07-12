/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandDark: "#0A0D14",
        brandCard: "#121724",
        brandBorder: "#1E2538",
        brandAccent: "#6366F1",
        brandCyan: "#06B6D4",
        brandPurple: "#A855F7",
      },
    },
  },
  plugins: [],
}
