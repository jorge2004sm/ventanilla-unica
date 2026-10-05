/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#448192',
          dark: '#36697A',  
          light: '#5A99AB',  
          options: '#0078A3',
          selected: '#44BBF6',
        },
      },
    },
  },
  plugins: [],
};