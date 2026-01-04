/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs primaires (valeurs EXACTES de Figma)
        primary: {
          500: '#6C78E6',
          600: '#575BC7',
        },
        // Neutre (valeurs EXACTES de Figma)
        neutral: {
          0: '#FFFFFF',
          50: '#F1F2F5',
          100: '#E2E4E9',
          200: '#BFC3CD',
          300: '#9BA0AB',
          400: '#787D88',
          500: '#565A64',
          600: '#3D4149',
          700: '#2A2D33',
          750: '#24272E',
          800: '#1E2025',
          850: '#181A1D',
          900: '#121315',
          950: '#0F1011',
        },
      },
      fontFamily: {
        sans: ['Satochi', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        '24': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        '20': ['20px', { lineHeight: '1.2', fontWeight: '700' }],
        '15': ['15px', { lineHeight: '1.4' }],
        '13': ['13px', { lineHeight: '1.4' }],
        '12': ['12px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        'btn': '8px',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(180deg, #0F1011 0%, #08090A 100%)',
      },
    },
  },
  plugins: [],
}