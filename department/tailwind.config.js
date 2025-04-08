/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'apple-gray': {
          50: '#f5f5f7',
          100: '#e6e6e6',
          200: '#d2d2d7',
          300: '#86868b',
          400: '#6e6e73',
          500: '#1d1d1f',
        },
        'apple-blue': {
          50: '#f2f7ff',
          100: '#e6f0ff',
          500: '#0071e3',
          600: '#0058b0',
          700: '#004080',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [],
};