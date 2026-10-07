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
          orange: "#FF5500",
          coral: "#FF3300",
          amber: "#FF7700",
          purple: "#9D52FF",
          violet: "#6E3AFF",
        },
        obsidian: {
          950: "#07060D",
          900: "#0B0A13",
          850: "#100E1B",
          800: "#161325",
          750: "#1C1830",
          700: "#25203E",
        },
        primary: "#FF5500",
        "background-light": "#f6f7f8",
        "background-dark": "#0B0A13",
        "surface-dark": "#12101D",
        "surface-light": "#ffffff",
        dark: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#25203E',
          800: '#161325',
          900: '#0B0A13',
          950: '#07060D',
        },
      },
      fontFamily: {
        display: ["Lexend", "Inter", "sans-serif"],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 35px -5px rgba(255, 85, 0, 0.45)',
        'glow-purple': '0 0 35px -5px rgba(157, 82, 255, 0.35)',
        'card-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'btn-gradient': 'linear-gradient(135deg, #FF5500 0%, #FF2A00 100%)',
        'btn-gradient-hover': 'linear-gradient(135deg, #FF6611 0%, #FF3D11 100%)',
        'heading-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 40%, #FF7700 80%, #9D52FF 100%)',
        'accent-gradient': 'linear-gradient(90deg, #FF5500 0%, #9D52FF 100%)',
        'hero-radial': 'radial-gradient(circle at 50% -20%, rgba(157, 82, 255, 0.18) 0%, rgba(255, 85, 0, 0.12) 35%, rgba(11, 10, 19, 0) 70%)',
        'card-gradient': 'linear-gradient(180deg, rgba(28, 24, 48, 0.6) 0%, rgba(18, 16, 29, 0.8) 100%)',
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
