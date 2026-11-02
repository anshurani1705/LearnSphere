/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Refined, mature, human-designed educational palette (Oxford Navy & Slate)
        brand: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#627d98',
          500: '#2b4c7e',
          600: '#1e3a8a', // Deep Oxford Navy
          700: '#172554',
          800: '#0f172a',
          900: '#0a0f1d',
          950: '#050811',
        },
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#627d98',
          500: '#2b4c7e',
          600: '#1e3a8a',
          700: '#172554',
          800: '#0f172a',
          900: '#0a0f1d',
          950: '#050811',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#0f172a',
          900: '#0b0f19',
        }
      },
      boxShadow: {
        // Restrained, clean tactile shadows (removed tacky neon spreads)
        'glow': '0 4px 14px -2px rgba(15, 23, 42, 0.08)',
        'glow-sm': '0 2px 6px -1px rgba(15, 23, 42, 0.06)',
        'glow-accent': '0 4px 14px -2px rgba(15, 23, 42, 0.08)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'premium': '0 4px 20px -4px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
