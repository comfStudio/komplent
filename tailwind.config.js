const { colors,  } = require('tailwindcss/defaultTheme')
let { variants } = require('tailwindcss/defaultConfig')

let additional_variants = ["important"]

Object.entries(variants).forEach(([k, v]) => {variants[k] = [...additional_variants, ...v]})

module.exports = {
  theme: {
    colors: {
      primary: '#e91e63',
      secondary: {
        default:'#575757',
        light:'#8e8e93'
      },
      success: {
        default: '#4caf50',
        light: '#edfae1',
      },
      info: {
        default: '#2196f3',
        light: '#e9f5fe',
      },
      warning: {
        default: '#ffb300',
        light: '#fff9e6',
      },
      error: {
        default: '#f44336',
        light: '#fde9ef',
      },
      red: '#f44336',
      orange: '#ff9800',
      yellow: '#ffca28',
      green: '#4caf50',
      cyan: '#00bcd4',
      blue: '#2196f3',
      violet: '#673ab7',
      ...colors,
    },
    extend: {}
  },
  variants: variants,
  plugins: [
    // prepend class with an exclamation mark to be important
    function({ addVariant }) {
      addVariant('important', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.\\!${rule.selector.slice(1)}`
          rule.walkDecls(decl => {
            decl.important = true
          })
        })
      })
    },
  ],
  screens: {
    'bs': '0px',
    'xs': '576px',
    'sm': '736px',
    'md': '980px',
    'lg': '1280px',
    'xl': '1690px',
    'tablet': '640px',
    'laptop': '1024px',
    'desktop': '1280px',
  },
}
