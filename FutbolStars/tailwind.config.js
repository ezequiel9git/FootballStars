/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-futbol',
    'bg-seleccion',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'futbol': "url('/fondos/Fondo5.png')",
        'seleccion': "url('/fondos/Fondo3.png')",
      },
    },
  },
  plugins: [],
}
