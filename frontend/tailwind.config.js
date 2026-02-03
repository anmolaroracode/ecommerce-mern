/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "primary": '#8da9c4',
        "secondary": '#7B96B2'
      }
    },
  },
  plugins: [],
}