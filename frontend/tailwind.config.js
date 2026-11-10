/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        card: 'var(--card)',
        border: 'var(--border)',
        accent: 'var(--accent)',
        violet: 'var(--violet)',
        'timeline-line': 'var(--timeline-line)',
        'bg-dark': 'var(--bg-dark)',
        panel: 'var(--panel)',
        'border-dark': 'var(--border-dark)',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        label: ['"Space Grotesk"', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
      },
      letterSpacing: {
        heading: '-0.02em',
        label: '0.14em',
      },
      transitionTimingFunction: {
        custom: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
