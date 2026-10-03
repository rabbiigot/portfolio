import type { Config } from 'tailwindcss';

// Palette carried over verbatim from the original static portfolio so the React
// port is visually identical.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050506', // pages — darkest, near-black
        'bg-soft': '#0b0c0e', // sidebar + panels (darker than before, lighter than pages)
        card: '#0e0f12',
        border: '#212329',
        text: '#e8e9ec',
        muted: '#9a9ca4',
        faint: '#6b6d76',
        accent: '#d7d9de',
        accent2: '#8a8d96',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl2: '16px',
      },
      maxWidth: {
        wrap: '1080px',
      },
      keyframes: {
        pulseDot: {
          '0%': { boxShadow: '0 0 0 0 rgba(52,211,153,.5)' },
          '70%': { boxShadow: '0 0 0 10px rgba(52,211,153,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(52,211,153,0)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 2s infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
