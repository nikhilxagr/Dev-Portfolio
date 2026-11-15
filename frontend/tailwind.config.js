/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0c1624',
        ink: '#d5e4f5',
        neon: {
          blue: '#00d4ff',
          green: '#00ffa8',
          deep: '#08111f',
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
        neon: '0 0 0 1px rgba(0, 212, 255, 0.35), 0 0 30px rgba(0, 212, 255, 0.18)',
      },
      backgroundImage: {
        'mesh-grid':
          'linear-gradient(rgba(0, 212, 255, 0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 168, 0.09) 1px, transparent 1px)',
      },
      keyframes: {
        pulseLine: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        pulseLine: 'pulseLine 3.2s ease-in-out infinite',
        floatY: 'floatY 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

