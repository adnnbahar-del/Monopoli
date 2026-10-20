/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink, #1E2149)',
        paper: 'var(--paper, #FFF8EC)',
        primary: {
          DEFAULT: 'var(--primary, #FF6B35)',
          hover: '#E85924',
          light: '#FFEBDC',
        },
        secondary: {
          DEFAULT: 'var(--secondary, #2EC4B6)',
          hover: '#25A99D',
          light: '#E2FAF7',
        },
        accent: {
          DEFAULT: 'var(--accent, #FFD23F)',
          hover: '#E6BA26',
        },
        success: 'var(--success, #22A55B)',
        danger: 'var(--danger, #E5484D)',
        zone: {
          1: '#FF8A80',
          2: '#FFB627',
          3: '#3BC47A',
          4: '#4D8DFF',
        },
        card: {
          kesempatan: '#FF7EB6',
          tantangan: '#7B5CFA',
        },
        team: {
          merah: '#E5484D',
          biru: '#3E7BFA',
          hijau: '#22A55B',
          oranye: '#F08C00',
          ungu: '#8E4EC6',
        }
      },
      fontFamily: {
        display: ['"Baloo 2"', 'cursive', 'sans-serif'],
        sans: ['"Nunito"', 'sans-serif'],
      },
      boxShadow: {
        'chunky': '0 6px 0 var(--shadow-color, #C95123)',
        'chunky-sm': '0 4px 0 var(--shadow-color, #C95123)',
        'chunky-pressed': '0 1px 0 var(--shadow-color, #C95123)',
        'soft-card': '0 12px 28px -6px rgba(30, 33, 73, 0.12), 0 4px 12px -2px rgba(30, 33, 73, 0.08)',
        'soft-card-hover': '0 20px 32px -8px rgba(30, 33, 73, 0.18), 0 6px 16px -2px rgba(30, 33, 73, 0.1)',
      },
      borderRadius: {
        'chunky': '20px',
        'card': '28px',
      }
    },
  },
  plugins: [],
}
