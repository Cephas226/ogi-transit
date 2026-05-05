/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e85d2f',
          hover:   '#d44e22',
          light:   '#fdf0eb',
          dark:    '#b84820',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted:   '#fafaf9',
          subtle:  '#f0ede8',
        },
        sidebar: {
          DEFAULT: '#1a1e2e',
        },
        success: {
          DEFAULT: '#10b981',
          light:   '#d1fae5',
          dark:    '#065f46',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light:   '#fef3c7',
          dark:    '#92400e',
        },
        danger: {
          DEFAULT: '#ef4444',
          light:   '#fee2e2',
          dark:    '#991b1b',
        },
        info: {
          DEFAULT: '#3b82f6',
          light:   '#dbeafe',
          dark:    '#1d4ed8',
        },
        ink: {
          DEFAULT:   '#1a1e2e',
          secondary: '#6b7280',
          muted:     '#9ca3af',
          disabled:  '#d1d5db',
        },
      },
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '18':  '4.5rem',
      },
      fontSize: {
        '2xs': ['0.625rem',  { lineHeight: '0.875rem' }],
        'xs':  ['0.6875rem', { lineHeight: '1rem' }],
        'sm':  ['0.75rem',   { lineHeight: '1.125rem' }],
        'base':['0.8125rem', { lineHeight: '1.25rem' }],
        'md':  ['0.875rem',  { lineHeight: '1.375rem' }],
        'lg':  ['1rem',      { lineHeight: '1.5rem' }],
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '10px',
        '2xl':'12px',
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'modal':   '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
        'dropdown':'0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
