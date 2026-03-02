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
        bg:       'var(--color-bg)',
        surface:  'var(--color-surface)',
        panel:    'var(--color-panel)',
        border:   'var(--color-border)',
        foreground: 'var(--color-foreground)',
        muted:      'var(--color-muted)',
        subtle:     'var(--color-subtle)',
        brand: {
          DEFAULT: 'var(--color-brand)',
          hover:   'var(--color-brand-hover)',
          muted:   'var(--color-brand-muted)',
        },
        status: {
          active:  'var(--color-status-active)',
          running: 'var(--color-status-running)',
          idle:    'var(--color-status-idle)',
          error:   'var(--color-status-error)',
        },
        domain: {
          content:  'var(--color-domain-content)',
          sales:    'var(--color-domain-sales)',
          ops:      'var(--color-domain-ops)',
          research: 'var(--color-domain-research)',
          finance:  'var(--color-domain-finance)',
          hr:       'var(--color-domain-hr)',
          tech:     'var(--color-domain-tech)',
        },
      },
      fontFamily: {
        sans:    ['var(--font-sans)',    'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '6px', md: '10px', lg: '14px', xl: '18px', '2xl': '24px',
      },
      boxShadow: {
        card:         '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.5)',
        'glow-sm':    '0 0 12px rgba(99,102,241,0.35)',
        'glow-md':    '0 0 24px rgba(99,102,241,0.25)',
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
}
export default config
