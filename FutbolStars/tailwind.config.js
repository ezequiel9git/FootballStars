/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'futbol': "url('/Fondo1.jpg')",
      },
    },
  },
  plugins: [],
}
