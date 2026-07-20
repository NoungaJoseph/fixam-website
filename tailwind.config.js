/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14B8A6',
          hover: '#0D9488',
        },
        accent: {
          DEFAULT: '#F97316',
        }
      }
    },
  },
  plugins: [],
}

