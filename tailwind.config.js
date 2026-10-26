/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#070a13',
          card: '#0f172a',
          cardHover: '#17223b',
          border: 'rgba(0, 255, 204, 0.25)',
          neon: '#00f2fe',
          cyan: '#4facfe',
          pink: '#f72585',
          purple: '#7209b7',
          amber: '#ffb703',
          green: '#10b981',
          danger: '#ef4444'
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 242, 254, 0.45)',
        'neon-pink': '0 0 15px rgba(247, 37, 133, 0.45)',
        'neon-purple': '0 0 15px rgba(114, 9, 183, 0.45)',
        'cyber-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.08)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
