/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        ogi: {
          dark: '#1a1e2e',
          darker: '#131622',
          orange: '#e85d2f',
          'orange-hover': '#d44e22',
          bg: '#f0ede8',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
