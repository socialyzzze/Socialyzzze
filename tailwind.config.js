/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0E090B',
        foreground: '#1A0F12',
        muted: '#EAD9C4',
        'muted-foreground': '#7A6B5E',
        border: 'rgba(26, 15, 18, 0.12)',

        whispy: {
          DEFAULT: '#8BADC8',
          light: '#A4C2D8',
          dark: '#6890AD',
        },
        blood: {
          DEFAULT: '#58111A',
          deep: '#3A0A10',
          bright: '#7A1825',
          accent: '#8E1D2E',
        },
        buttercream: {
          DEFAULT: '#F4E8D7',
          light: '#FBF5ED',
          dark: '#E2D1B8',
          text: '#2C2219',
        },
        dark: {
          bg: '#0E090B',
          card: '#160E12',
          card2: '#1C1217',
          border: 'rgba(244, 232, 215, 0.12)',
        },
        cream: {
          DEFAULT: '#F4E8D7',
          warm: '#EFE0CC',
          pale: '#FBF5ED',
          deep: '#E2D1B8',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        display: ['Syne', 'Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
