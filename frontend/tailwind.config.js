/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Pixelify Sans"', '"Press Start 2P"', 'cursive', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      colors: {
        // Restricted to Yellow & Orange visual identity
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        brand: {
          50:  '#fffbe6',
          100: '#fff3b8',
          200: '#ffe68a',
          300: '#fde047',
          400: '#fbbf24', // Primary Yellow
          500: '#f59e0b', // Deep Amber Yellow
          600: '#d97706', // Dark Yellow-Gold
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        accent: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c', // Bright Orange
          500: '#f97316', // Primary Orange
          600: '#ea580c', // Dark Orange
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        surface: {
          DEFAULT: '#0d0d12',
          1: '#14141c',
          2: '#1f1f2b',
          3: '#2a2a3b',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
        'gradient-gold':  'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f97316 100%)',
        'gradient-dark':  'linear-gradient(180deg, #0d0d12 0%, #14141c 100%)',
      },
      boxShadow: {
        glow:       '0 0 20px rgba(245, 158, 11, 0.35)',
        'glow-lg':  '0 0 40px rgba(249, 115, 22, 0.45)',
        'glow-gold':'0 0 25px rgba(251, 191, 36, 0.4)',
        pixel:      '4px 4px 0px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.35s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':      'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        glowPulse: { '0%,100%': { opacity: 0.8 }, '50%': { opacity: 1, filter: 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.8))' } },
      },
    },
  },
  plugins: [],
};
