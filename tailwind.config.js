/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        syne:    ['var(--font-syne)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-syne)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── New earthy palette ──────────────────────────────────
        primary: '#546B41',        // forest green — deep anchor
        'primary-light': '#99AD7A',// sage — medium green
        secondary: '#99AD7A',      // sage green
        tertiary: '#DCCCAC',       // warm beige
        accent: '#b8c99a',         // light sage
        forest: {
          DEFAULT: '#546B41',
          dark: '#2d3d24',
          deeper: '#1e2d14',
          light: '#6b8a52',
          card: 'rgba(84, 107, 65, 0.15)',
        },
        sage: {
          DEFAULT: '#99AD7A',
          light: '#b8c99a',
          dark: '#7a9060',
          muted: 'rgba(153, 173, 122, 0.35)',
        },
        beige: {
          DEFAULT: '#DCCCAC',
          light: '#efe4cc',
          dark: '#c8b48c',
          card: 'rgba(220, 204, 172, 0.45)',
        },
        cream: {
          DEFAULT: '#FFF8EC',
          dark: '#f5edd8',
          deeper: '#ecdec5',
        },
        dark: {
          DEFAULT: '#2d3d24',
          lighter: '#3d5030',
          card: 'rgba(84, 107, 65, 0.25)',
        },
        light: '#FFF8EC',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(145deg, rgba(255,248,236,0.25) 0%, rgba(255,248,236,0.05) 100%)',
        'nature-gradient': 'linear-gradient(135deg, #546B41 0%, #99AD7A 50%, #DCCCAC 100%)',
        'forest-gradient': 'linear-gradient(135deg, #2d3d24 0%, #546B41 100%)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 10s infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
        'sway': 'sway 8s ease-in-out infinite',
        'organic-pulse': 'organic-pulse 5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.75', filter: 'brightness(1.4)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'blob': {
          '0%': { transform: 'scale(1) translate(0px, 0px)' },
          '33%': { transform: 'scale(1.08) translate(25px, -40px)' },
          '66%': { transform: 'scale(0.94) translate(-15px, 18px)' },
          '100%': { transform: 'scale(1) translate(0px, 0px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'sway': {
          '0%, 100%': { transform: 'rotate(-1deg) translateX(0)' },
          '50%': { transform: 'rotate(1deg) translateX(4px)' },
        },
        'organic-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
      },
      boxShadow: {
        'nature': '0 4px 24px rgba(84, 107, 65, 0.15), 0 1px 4px rgba(84, 107, 65, 0.08)',
        'nature-lg': '0 8px 40px rgba(84, 107, 65, 0.2), 0 2px 8px rgba(84, 107, 65, 0.1)',
        'sage-glow': '0 0 20px rgba(153, 173, 122, 0.45), 0 0 60px rgba(153, 173, 122, 0.15)',
        'forest-glow': '0 0 25px rgba(84, 107, 65, 0.4), 0 0 70px rgba(84, 107, 65, 0.12)',
        'warm': '0 4px 32px rgba(84, 107, 65, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
        'warm-lg': '0 8px 40px rgba(84, 107, 65, 0.14), inset 0 1px 0 rgba(255,255,255,0.9)',
      }
    },
  },
  plugins: [],
};