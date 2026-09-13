/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 999x Brand Colors — extracted from logo_999x.jpg
      // Logo: deep purple bg (#2B0D4F) + bright lime-green icon (#9ACD32 / #A8D840) + cream text
      colors: {
        canvas: '#1A0533',      // Deepest background — logo background darkness
        surface: '#240842',     // Card/panel background
        elevated: '#321060',    // Raised elements
        lime: '#A8D840',        // Logo icon green — bright lime-yellow-green
        pistachio: '#E8F5C8',   // Cream text — logo cream highlights
        violet: '#6B21A8',      // Logo deep purple accent
      },
      fontFamily: {
        unbounded: ['Unbounded', 'sans-serif'],
        alexandria: ['Alexandria', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: { '2xl': '16px', '3xl': '24px' },
    },
  },
  plugins: [],
};
