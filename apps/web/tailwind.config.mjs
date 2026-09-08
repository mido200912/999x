/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        canvas: '#150320',
        surface: '#220633',
        elevated: '#300a48',
        'elevated-soft': '#3b0d59',
        lime: '#A3E635',
        pistachio: '#F3F8CC',
        violet: '#8B5CF6',
        'violet-deep': '#581C87',
      },
      fontFamily: {
        unbounded: ['Unbounded','sans-serif'],
        alexandria: ['Alexandria','sans-serif'],
        body: ['Plus Jakarta Sans','system-ui','sans-serif'],
        mono: ['JetBrains Mono','monospace'],
      },
      borderRadius: { '2xl': '16px', '3xl': '24px' },
    },
  },
  plugins: [],
};
