/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#15130F",
          soft: "#2A2620",
        },
        sun: {
          DEFAULT: "#E8720C",
          light: "#F4934A",
          dark: "#C25C05",
        },
        gold: {
          DEFAULT: "#F2B705",
          light: "#FBD756",
        },
        cream: "#FAF7F1",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
