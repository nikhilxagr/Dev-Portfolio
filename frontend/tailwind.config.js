/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#11141c',
        ink: {
          DEFAULT: '#eef0f5',
          50: '#f8fafc',
          100: '#eef0f5',
          200: '#dde2ec',
          300: '#c7cddb',
          400: '#a3a9b8',
          500: '#7a8296',
          600: '#5a6377',
          700: '#3f4759',
          800: '#272c3a',
          900: '#161a24',
          950: '#090a0f',
        },
        surface: {
          deep: '#07080d',
          base: '#090a0f',
          card: '#11141c',
          raised: '#1a1e28',
        },
        neon: {
          blue: '#34d399',
          green: '#10b981',
          deep: '#090a0f',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        syne: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        outfit: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(16, 185, 129, 0.35)',
        highlight: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      },
      backgroundImage: {
        'mesh-grid':
          'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}

