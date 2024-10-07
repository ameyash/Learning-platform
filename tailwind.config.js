/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        'white': '#ffffff',
        'black': '#000000',
        'gray-light': '#f5f5f5',
        'gray-dark': '#333333',
      },
    },
  },
  plugins: [],
}

