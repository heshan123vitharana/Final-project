/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rice-gold': '#D4AF37',
        'paddy-green': '#4A6741',
        'earth-brown': '#8B4513',
        'fresh-green': '#90EE90',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'float-reverse 6s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-out',
        'fade-in-delayed': 'fadeIn 1s ease-out 0.5s',
        'fade-in-up': 'fadeInUp 1s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-up-delayed': 'slideUp 0.8s ease-out 0.3s',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 1s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        // Professional page transitions
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-up': 'slideInUp 0.5s ease-out',
        'slide-in-down': 'slideInDown 0.5s ease-out',
        'slide-out-left': 'slideOutLeft 0.3s ease-in',
        'slide-out-right': 'slideOutRight 0.3s ease-in',
        'slide-out-up': 'slideOutUp 0.3s ease-in',
        'slide-out-down': 'slideOutDown 0.3s ease-in',
        'fade-scale-in': 'fadeScaleIn 0.5s ease-out',
        'fade-scale-out': 'fadeScaleOut 0.3s ease-in',
        'blur-in': 'blurIn 0.5s ease-out',
        'blur-out': 'blurOut 0.3s ease-in',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(-10px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-2deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(50px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Professional page transition keyframes
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        slideOutUp: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        slideOutDown: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        fadeScaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0', filter: 'blur(4px)' },
          '100%': { transform: 'scale(1)', opacity: '1', filter: 'blur(0px)' },
        },
        fadeScaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1', filter: 'blur(0px)' },
          '100%': { transform: 'scale(0.8)', opacity: '0', filter: 'blur(4px)' },
        },
        blurIn: {
          '0%': { filter: 'blur(10px)', opacity: '0' },
          '100%': { filter: 'blur(0px)', opacity: '1' },
        },
        blurOut: {
          '0%': { filter: 'blur(0px)', opacity: '1' },
          '100%': { filter: 'blur(10px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

