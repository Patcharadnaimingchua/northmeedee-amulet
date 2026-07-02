/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf6ec',
          100: '#f9e7c9',
          200: '#f2ce93',
          300: '#e9b05c',
          400: '#dd8f34',
          500: '#b5711f',
          600: '#8f5717',
          700: '#6c4113',
          800: '#4a2c0e',
          900: '#2c1a08',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
