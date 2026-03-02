/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#371d54',
        secondary: '#614c77',
        success: '#28a745',
        failure: '#dc3545',
        gray: {
          light: '#f5f5f5',
          DEFAULT: '#cccccc',
          dark: '#777777',
        }
      },
    },
  },
  plugins: [],
};