/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AlbaniaTours Premium Color Palette - Vibrant & High Contrast
        primary: '#C1272D', // Red from Albanian flag (accent)
        primaryDark: '#A01F24',
        secondary: '#004D60', // Deep Blue
        secondaryLight: '#007A99',
        secondaryDark: '#002F3D',
        tertiary: '#40E0D0', // Turquoise for travel/vibes
        tertiaryDark: '#00CED1',
        tertiaryLight: '#80F0E0',
        accent: '#D4AF37', // Golden accents
        accentDark: '#B8860B',
        accentLight: '#F0C850',
        white: '#FFFFFF',
        offWhite: '#FDFDFD',
        textDark: '#111111',
        textLight: '#333333',
        textMuted: '#666666',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        border: '#E0E0E0',
        cardShadow: 'rgba(0, 0, 0, 0.1)',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        // Gradients
        gradientPrimary: 'linear-gradient(135deg, #004D60 0%, #007A99 100%)',
        gradientSecondary: 'linear-gradient(135deg, #C1272D 0%, #A01F24 100%)',
        gradientGold: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
        gradientTertiary: 'linear-gradient(135deg, #40E0D0 0%, #00CED1 100%)',
        gradientHero: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-slow': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)' },
        },
      },
      boxShadow: {
        'premium': '0 4px 24px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'premium-lg': '0 10px 40px rgba(0, 0, 0, 0.08), 0 6px 20px rgba(0, 0, 0, 0.05)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
      },
    },
  },
  plugins: [],
};
