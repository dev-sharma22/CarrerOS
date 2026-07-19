/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255, 255, 255, 0.05)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
        darkBg: '#0b0f19',
        darkCard: '#131c2e',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
