const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@apideck/react-vault/**/*.js',
    './node_modules/@apideck/components/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        'basier-circle': ['Basier Circle', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        gray: colors.slate,
        primary: colors.cyan,
        ui: {
          200: '#878ac6',
          300: '#545592',
          400: '#414386',
          500: '#292d6a',
          600: '#21255c',
          700: '#080b4b',
          800: '#04072d'
        },
        'apideck-primary': '#8a13f2',
        'apideck-secondary': '#5c51ce'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
