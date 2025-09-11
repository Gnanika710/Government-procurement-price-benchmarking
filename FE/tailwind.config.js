/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        dark : '#353A5F' ,
        middle : '#7DA0CA' ,
        light: '#F1F7F7' ,
      }
    },
  },
  plugins: [],
}