/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Calm page backgrounds (semantic)
        surface: {
          DEFAULT: '#fafbfc',
          muted: '#f4f6f9',
        },
        surfaceWarm: {
          DEFAULT: '#f7f5f0',
          deep: '#f0ebe3',
        },
        // Navy blue — headings, nav, primary buttons (pairs with gold secondary + red accent)
        primary: {
          DEFAULT: '#243b68',
          50: '#f3f6fb',
          100: '#e8eef7',
          200: '#c7d6ea',
          300: '#a0b8d9',
          400: '#6d90bf',
          500: '#4a719f',
          600: '#375986',
          700: '#2c476e',
          800: '#263b5c',
          900: '#1f324a',
        },
        // SG logo: hex border gold
        secondary: {
          DEFAULT: '#FFCB2B',
          50: '#FFFBEB',
          100: '#FEF6D4',
          200: '#FEECA8',
          300: '#FDDF7A',
          400: '#FCD04D',
          500: '#F5C02E',
          600: '#FFCB2B',
          700: '#E6B525',
          800: '#C4981F',
          900: '#9A7618',
        },
        // SG logo: red "G" — accents, badges, secondary CTAs
        accent: {
          DEFAULT: '#ED3237',
          50: '#FEF2F2',
          100: '#FEE2E3',
          200: '#FEC8CA',
          300: '#FCA5A8',
          400: '#F56B6F',
          500: '#ED4B50',
          600: '#ED3237',
          700: '#CC2B30',
          800: '#A82428',
          900: '#7F1C20',
        },
        white: {
          DEFAULT: '#FFFFFF',
          50: '#FFFFFF',
          100: '#FEFEFE',
          200: '#FDFDFD',
          300: '#FCFCFC',
          400: '#FBFBFB',
          500: '#FAFAFA',
          600: '#F9F9F9',
          700: '#F8F8F8',
          800: '#F7F7F7',
          900: '#F6F6F6',
        },
        // Clean neutrals
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
      maxWidth: {
        content: '72rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 24px -4px rgba(36, 59, 104, 0.08), 0 8px 16px -8px rgba(36, 59, 104, 0.06)',
        'float': '0 20px 40px -12px rgba(36, 59, 104, 0.12), 0 8px 16px -8px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'marquee-logos': 'marqueeLogos 45s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marqueeLogos: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
