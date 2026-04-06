/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          red: "#FF3131",
          black: "#0A0A0A",
          gray: "#1F1F1F",
          slate: "#121212",
        }
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
