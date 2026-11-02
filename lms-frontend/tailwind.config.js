/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Fraunces', 'Source Serif 4', 'Georgia', 'serif'],
      },
      colors: {
        bg: '#FAF8F5',
        surface: '#FFFFFF',
        border: '#E7E2DA',
        ink: '#1F2328',
        text: {
          primary: '#1F2328',
          secondary: '#5F6368',
        },
        primary: {
          DEFAULT: '#0E6B6B',
          hover: '#0A5555',
          soft: '#E6F2F1',
        },
        accent: {
          DEFAULT: '#D9663A',
          hover: '#C2552B',
        },
        success: '#2F855A',
        warning: '#B7791F',
        error: '#C0392B',
      },
      borderRadius: {
        DEFAULT: '6px',
        card: '8px',
        input: '8px',
        btn: '6px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        card: '0 1px 2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 2px 6px rgba(0, 0, 0, 0.07)',
      },
      maxWidth: {
        prose: '65ch',
      },
    },
  },
  plugins: [],
}
