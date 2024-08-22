/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        Poppins:[ "Poppins", "sans-serif"],
        LondrinaOutline:["Londrina Outline", "sans-serif"],
        workSans:[ "Work Sans", "sans-serif"],
        inter:["Inter", "sans-serif"]
      },
    },
  },
  // plugins: [],
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    // ...
  ],
}

