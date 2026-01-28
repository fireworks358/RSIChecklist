/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nhs: {
          blue: '#005EB8',
          white: '#FFFFFF',
          grey: '#F0F4F5',
          'dark-grey': '#425563',
          'mid-grey': '#768692',
          black: '#000000',
          'warm-yellow': '#FFB81C'
        }
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif']
      },
      fontSize: {
        'touch-xl': ['2rem', { lineHeight: '2.5rem' }],
        'touch-2xl': ['2.5rem', { lineHeight: '3rem' }],
        'touch-3xl': ['3rem', { lineHeight: '3.5rem' }]
      },
      spacing: {
        'touch': '60px',
        'touch-lg': '80px',
        'touch-xl': '100px'
      },
      screens: {
        'tablet': '1366px',
      }
    },
  },
  plugins: [],
}
