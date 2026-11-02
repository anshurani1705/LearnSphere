/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Human-centred design system
        navy: {
          50: '#F4F6F9',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',
          800: '#172B4D', // Primary Deep Navy
          900: '#0F1E36',
          950: '#0A1322',
        },
        teal: {
          50: '#F0F9F8',
          100: '#D4ECE9',
          200: '#A8D9D4',
          300: '#7BC5BE',
          400: '#4EB2A9',
          500: '#287C78', // Secondary Muted Teal
          600: '#216764',
          700: '#1A5250',
          800: '#133D3C',
          900: '#0C2726',
        },
        charcoal: {
          DEFAULT: '#20252B',
          900: '#20252B',
          800: '#2E353D',
          700: '#3E4651',
          600: '#525C6A',
        },
        muted: {
          DEFAULT: '#697386',
          light: '#8F9CAE',
          dark: '#4E5664',
        },
        warm: {
          white: '#FAFAF8',
          surface: '#FFFFFF',
          border: '#E5E7EB',
        },
        // Backward-compatible tokens mapped to the professional palette
        brand: {
          50: '#F4F6F9',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#486581',
          500: '#172B4D',
          600: '#13233F',
          700: '#0E1B31',
          800: '#0A1322',
          900: '#060B14',
          950: '#03060A',
        },
        primary: {
          50: '#F4F6F9',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#486581',
          500: '#172B4D',
          600: '#13233F',
          700: '#0E1B31',
          800: '#0A1322',
          900: '#060B14',
          950: '#03060A',
        },
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px -2px rgba(23, 43, 77, 0.08), 0 2px 6px -2px rgba(23, 43, 77, 0.04)',
        'dropdown': '0 10px 25px -5px rgba(23, 43, 77, 0.1), 0 8px 10px -6px rgba(23, 43, 77, 0.05)',
        'modal': '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
        // Retain compatibility keys without neon glow
        'glow': '0 4px 12px -2px rgba(23, 43, 77, 0.08)',
        'glow-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'glow-accent': '0 4px 12px -2px rgba(40, 124, 120, 0.12)',
        'premium': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
