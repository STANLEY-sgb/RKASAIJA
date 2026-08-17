/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7EF',
        dark: '#2A1D10',
        darker: '#1F1308',
        gold: '#B8956A',
        'gold-mid': '#8B6F47',
        light: '#F6EDDA',
        light2: '#E8D8B4',
        border: 'rgba(139, 111, 71, 0.2)',
        shadow: 'rgba(61, 40, 23, 0.15)',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter Tight', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        widest: '0.28em',
      },
      animation: {
        'marquee': 'marquee 45s linear infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 0.6s ease both',
      },
      keyframes: {
        marquee: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(28px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
