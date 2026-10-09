/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#F59E0B",
          amber: "#F59E0B",
          gold: "#FBBF24",
          coral: "#D97706",
          navy: "#1E3A8A",
          blue: "#3B82F6",
          purple: "#1E3A8A",
          violet: "#2563EB",
        },
        obsidian: {
          950: "#05070A",
          900: "#090C10",
          850: "#0F141C",
          800: "#151B26",
          750: "#1C2432",
          700: "#242E40",
        },
        primary: "#F59E0B",
        "background-light": "#f6f7f8",
        "background-dark": "#05070A",
        "surface-dark": "#090C10",
        "surface-light": "#ffffff",
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#1e293b',
          800: '#151b26',
          900: '#090c10',
          950: '#05070a',
        },
      },
      fontFamily: {
        display: ["Lexend", "Inter", "sans-serif"],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 35px -5px rgba(245, 158, 11, 0.45)',
        'glow-amber': '0 0 35px -5px rgba(245, 158, 11, 0.45)',
        'glow-purple': '0 0 35px -5px rgba(30, 58, 138, 0.35)',
        'card-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'btn-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'btn-gradient-hover': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
        'heading-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #FDE68A 40%, #F59E0B 80%, #3B82F6 100%)',
        'accent-gradient': 'linear-gradient(90deg, #F59E0B 0%, #1E3A8A 100%)',
        'hero-radial': 'radial-gradient(circle at 50% -20%, rgba(30, 58, 138, 0.25) 0%, rgba(245, 158, 11, 0.15) 35%, rgba(5, 7, 10, 0) 70%)',
        'card-gradient': 'linear-gradient(180deg, rgba(21, 27, 38, 0.7) 0%, rgba(9, 12, 16, 0.9) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s infinite ease-in-out',
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
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(20px)' },
          '50%': { opacity: '0.8', filter: 'blur(30px)' },
        },
      },
    },
  },
  plugins: [],
}
