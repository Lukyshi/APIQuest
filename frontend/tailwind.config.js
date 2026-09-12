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
        // Jungle Temple Theme Palette
        moss: {
          950: '#060d08',
          900: '#0a140d',
          850: '#0d1a11',
          800: '#112217',
          700: '#183020',
          600: '#22442e',
        },
        olive: {
          900: '#122016',
          800: '#182c1f',
          700: '#203a29',
          600: '#2a4b36',
          500: '#386348',
        },
        emerald: {
          300: '#6ee7b7',
          400: '#34d399', // Primary Accent
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        amber: {
          300: '#fde68a',
          400: '#fbbf24', // Golden Accent / CTAs
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        stone: {
          850: '#1a231d',
          800: '#232f27',
          750: '#2b3a30',
          700: '#36473c',
        },
        surface: {
          DEFAULT: '#08110b',
          1: '#0e1c12',
          2: '#14271a',
          3: '#1c3423',
        },
      },
      backgroundImage: {
        'jungle-gradient': 'linear-gradient(180deg, rgba(8, 17, 11, 0.75) 0%, rgba(10, 20, 13, 0.92) 50%, #060d08 100%)',
        'stone-gradient': 'linear-gradient(135deg, rgba(24, 44, 31, 0.95) 0%, rgba(14, 28, 18, 0.98) 100%)',
        'emerald-glow': 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
        'amber-glow': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
      },
      boxShadow: {
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.35)',
        'amber-glow': '0 0 20px rgba(245, 158, 11, 0.4)',
        'stone-pixel': '3px 3px 0px #030804, -1px -1px 0px rgba(52, 211, 153, 0.15)',
        'stone-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'spore-drift': 'sporeDrift 8s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
    },
  },
  plugins: [],
};
