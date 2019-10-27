const { colors,  } = require('tailwindcss/defaultTheme')
let { variants } = require('tailwindcss/defaultConfig')

let additional_variants = ["important"]

Object.entries(variants).forEach(([k, v]) => {variants[k] = [...additional_variants, ...v]})

module.exports = {
  theme: {
    colors: {
      primary: '#EE6666',
      secondary: {
        default:'#575757',
        light:'#8e8e93'
      },
      success: {
        default: '#21ba45',
        light: '#edfae1',
      },
      info: {
        default: '#2185d0',
        light: '#e9f5fe',
      },
      warning: {
        default: '#fbbd08',
        light: '#fff9e6',
      },
      error: {
        default: '#db2828',
        light: '#fde9ef',
      },
      red: '#db2828',
      orange: '#f2711c',
      yellow: '#fbbd08',
      green: '#21ba45',
      cyan: '#00b5ad',
      blue: '#2185d0',
      violet: '#a333c8',
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
