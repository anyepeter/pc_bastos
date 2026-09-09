import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['var(--font-inter)', 'sans-serif'],
        'playfair': ['var(--font-playfair)', 'serif'],
        'poppins': ['var(--font-poppins)', 'sans-serif'],
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
        // Display face for the landing page and shared chrome.
        // Headings: a serif, which reads far more ecclesiastical than a
        // geometric sans. `ui` keeps the geometric face for buttons/nav.
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        ui: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        /* Neutrals, tinted violet so they sit under the accent rather than
           fighting it. 50-200 are surfaces and hairlines; 500-900 are text.
           ink-600 on white is ~7.4:1, ink-500 ~4.9:1 — both readable. */
        ink: {
          50: '#FAF9FC',
          100: '#F4F2F8',
          200: '#E6E2EF',
          300: '#CBC5DA',
          400: '#A199B5',
          500: '#786F8C',
          600: '#584F6B',
          700: '#413A52',
          800: '#2C2639',
          900: '#1B1626',
          950: '#110D1A',
        },
        /* The accent that pairs with plum. The reference design runs a deep
           structural colour against a brighter highlight; here plum is the
           structure and leaf is the highlight. Desaturated so the two sit
           together rather than competing. leaf-600 on white is ~5.9:1. */
        leaf: {
          50: '#EDF7F1',
          100: '#D6EDE0',
          200: '#AEDCC2',
          300: '#7FC4A0',
          400: '#51A87D',
          500: '#348C61',
          600: '#27714E',
          700: '#1F5A3F',
          800: '#1A4733',
          900: '#123123',
          950: '#0B1F16',
        },
        /* The single accent. plum-600 on white is ~6.4:1. */
        plum: {
          50: '#F6F3FE',
          100: '#EDE7FC',
          200: '#DCD0F9',
          300: '#C1ACF3',
          400: '#A282E9',
          500: '#8459DC',
          600: '#6D3FC8',
          700: '#5B32A6',
          800: '#4A2A85',
          900: '#33205C',
          950: '#1F1338',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      transitionTimingFunction: {
        // Spring-ish ease; replaces the default linear/ease on interactions.
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      zIndex: {
        nav: '50',
        overlay: '60',
        float: '70',
      },
      keyframes: {
        'drift': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -14px, 0)' },
        },
        'sheen': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'drift': 'drift 9s ease-in-out infinite',
        'sheen': 'sheen 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;