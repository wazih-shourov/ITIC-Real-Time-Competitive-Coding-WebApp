/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          sidebar: 'var(--background-sidebar)',
          secondary: 'var(--background-secondary)',
          primary: 'var(--background-primary)',
          modifier: 'var(--background-modifier)',
          elevated: 'var(--background-elevated)',
        },
        brand: {
          DEFAULT: 'var(--brand-primary)',
          hover: 'var(--brand-hover)',
          muted: 'var(--brand-muted)',
        },
        success: {
          DEFAULT: 'var(--success)',
        },
        error: {
          DEFAULT: '#F43F5E',
        },
        warning: {
          DEFAULT: '#F59E0B',
        },
        surface: {
          50: 'var(--surface-50)',
          100: 'var(--surface-100)',
          200: 'var(--surface-200)',
          300: 'var(--surface-300)',
          400: 'var(--surface-400)',
          500: 'var(--surface-500)',
          600: 'var(--surface-600)',
          700: 'var(--surface-700)',
          800: 'var(--surface-800)',
          900: 'var(--surface-900)',
        }
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'premium': '0 4px 20px -4px rgba(0, 0, 0, 0.7)',
        'accent': '0 0 15px -3px rgba(255, 107, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
