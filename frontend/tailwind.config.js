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
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(31, 35, 40, 0.04)',
        'card': '0 1px 3px rgba(31, 35, 40, 0.06), 0 1px 2px rgba(31, 35, 40, 0.04)',
        'elevated': '0 4px 12px rgba(31, 35, 40, 0.08), 0 1px 3px rgba(31, 35, 40, 0.04)',
        'focus-ring': '0 0 0 3px rgba(9, 105, 218, 0.15)',
        'button': '0 1px 2px rgba(9, 105, 218, 0.2), 0 0 0 1px rgba(9, 105, 218, 0.1)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
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
        'spin-slow': 'spin 3s linear infinite',
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
