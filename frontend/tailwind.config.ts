import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        panel: 'var(--color-panel)',
        border: 'var(--color-border)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        subtle: 'var(--color-subtle)',
        brand: {
          DEFAULT: 'var(--color-brand)',
          hover: 'var(--color-brand-hover)',
          muted: 'var(--color-brand-muted)',
        },
        status: {
          active: 'var(--color-status-active)',
          running: 'var(--color-status-running)',
          idle: 'var(--color-status-idle)',
          error: 'var(--color-status-error)',
        },
        domain: {
          content: 'var(--color-domain-content)',
          sales: 'var(--color-domain-sales)',
          ops: 'var(--color-domain-ops)',
          research: 'var(--color-domain-research)',
          finance: 'var(--color-domain-finance)',
          hr: 'var(--color-domain-hr)',
          tech: 'var(--color-domain-tech)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '6px', md: '10px', lg: '12px', xl: '16px', '2xl': '20px', '3xl': '24px', full: '9999px',
      },
      boxShadow: {
        card: '0 0 40px -8px rgba(99,102,241,0.06)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.35)',
        'glow-sm': '0 0 20px rgba(99,102,241,0.25)',
        'glow-md': '0 0 35px rgba(99,102,241,0.35)',
        'glow-lg': '0 0 50px rgba(99,102,241,0.4)',
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        '3xs': ['0.55rem', { lineHeight: '0.85rem' }],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366f1, #a78bfa)',
        'gradient-dark': 'linear-gradient(to bottom, #0c0c10, #050507)',
        'gradient-card': 'linear-gradient(135deg, rgba(99,102,241,0.06), transparent)',
      },
      animation: {
        'fade-in': 'fadeIn 0.45s ease both',
        'slide-up': 'slideUp 0.45s ease both',
        'float': 'float 4s ease-in-out infinite',
        'ping-soft': 'pingSoft 2.2s cubic-bezier(0,0,0.2,1) infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-6px)' } },
        pingSoft: { '0%': { transform: 'scale(1)', opacity: '0.5' }, '100%': { transform: 'scale(1.6)', opacity: '0' } },
      },
    },
  },
  plugins: [],
}

export default config
