/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        civic: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        worker: {
          50: '#fffbe6',
          100: '#fef08a',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
        admin: {
          bg: '#0b0f19',
          card: '#111827',
          border: '#1f2937',
          accent: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
