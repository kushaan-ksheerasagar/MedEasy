/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medeasy: {
          primary: '#087E8B',      // Primary Teal
          secondary: '#12A4A6',    // Secondary Teal
          mint: '#7CC9C3',         // Soft Mint
          bg: '#F6FAFA',           // Background
          surface: '#FFFFFF',      // Surface
          navy: '#16324F',         // Deep Navy
          textSec: '#668096',      // Secondary Text
          success: '#3A9D74',      // Success / Green
          warning: '#E9A23B',      // Warning / Amber
          critical: '#D95D5D',     // Critical / Red
          lightTeal: '#EAF7F6',    // Very Light Teal
          lightBlue: '#EEF5FA',    // Very Light Blue
        },
        // Direct aliases for convenience
        brand: {
          50: '#EAF7F6',
          100: '#D2EFEF',
          200: '#A7DFDD',
          300: '#7CC9C3',
          400: '#34B3B0',
          500: '#12A4A6',
          600: '#087E8B',
          700: '#066570',
          800: '#054D56',
          900: '#16324F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'input': '12px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(22, 50, 79, 0.04), 0 1px 2px -1px rgba(22, 50, 79, 0.04)',
        'card': '0 2px 8px -2px rgba(22, 50, 79, 0.05), 0 1px 4px -1px rgba(22, 50, 79, 0.03)',
        'elevated': '0 10px 25px -5px rgba(22, 50, 79, 0.08), 0 8px 10px -6px rgba(22, 50, 79, 0.04)',
        'drawer': '-10px 0 30px -5px rgba(22, 50, 79, 0.12)',
      }
    },
  },
  plugins: [],
}
