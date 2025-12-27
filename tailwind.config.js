/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E5C100',
          dark: '#C9A900',
          light: '#F5E066',
        },
        dark: {
          DEFAULT: '#1a1a1a',
          lighter: '#2a2a2a',
        },
        success: '#22c55e',
        warning: '#eab308',
        info: '#3b82f6',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
