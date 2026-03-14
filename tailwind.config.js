/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel Decorative', 'serif'],
        mono: ['Orbitron', 'monospace'],
        body: ['Raleway', 'sans-serif'],
      },
      colors: {
        casino: {
          bg: '#080810',
          panel: '#0E0E1A',
          border: '#2A2A45',
          gold: '#D4AF37',
          'gold-light': '#FFE066',
          'gold-dark': '#8B7012',
          red: '#C8102E',
          'red-light': '#FF2D55',
          green: '#00B050',
          'green-light': '#30D158',
          felt: '#1A3A2A',
        },
      },
      animation: {
        'spin-reel': 'spinReel 0.1s linear infinite',
        'glow-pulse': 'glowPulse 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        spinReel: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-33.33%)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.2)',
        'red-glow': '0 0 20px rgba(200,16,46,0.6), 0 0 40px rgba(200,16,46,0.3)',
        'inner-deep': 'inset 0 4px 20px rgba(0,0,0,0.8)',
      },
    },
  },
  plugins: [],
}
