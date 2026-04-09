/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#12121a',
        surface2: '#1a1a26',
        border: '#1e1e2e',
        'accent-green': '#22d67a',
        'accent-purple': '#818cf8',
        'accent-amber': '#f59e0b',
        'accent-red': '#ef4444',
        'text-primary': '#e2e8f0',
        'text-muted': '#64748b',
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'message-in': 'messageIn 0.3s ease-out',
        'inject-flash': 'injectFlash 0.6s ease-out',
        'score-reveal': 'scoreReveal 1s ease-out forwards',
        'dot-pulse': 'dotPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(245, 158, 11, 0.2), 0 0 20px rgba(245, 158, 11, 0.1)' },
          '50%': { boxShadow: '0 0 15px rgba(245, 158, 11, 0.6), 0 0 40px rgba(245, 158, 11, 0.3)' },
        },
        messageIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        injectFlash: {
          '0%': { backgroundColor: 'rgba(245, 158, 11, 0.3)' },
          '50%': { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
          '100%': { backgroundColor: 'transparent' },
        },
        scoreReveal: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--target-offset)' },
        },
        dotPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [],
}
