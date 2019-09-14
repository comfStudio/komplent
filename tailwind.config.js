const { colors } = require('tailwindcss/defaultTheme')

let variants = {
  alignContent: ['responsive'],
  alignItems: ['responsive'],
  alignSelf: ['responsive'],
  appearance: ['responsive'],
  backgroundAttachment: ['responsive'],
  backgroundColor: ['responsive', 'hover', 'focus'],
  backgroundPosition: ['responsive'],
  backgroundRepeat: ['responsive'],
  backgroundSize: ['responsive'],
  borderCollapse: ['responsive'],
  borderColor: ['responsive', 'hover', 'focus'],
  borderRadius: ['responsive'],
  borderStyle: ['responsive'],
  borderWidth: ['responsive'],
  boxShadow: ['responsive', 'hover', 'focus'],
  cursor: ['responsive'],
  display: ['responsive'],
  fill: ['responsive'],
  flex: ['responsive'],
  flexDirection: ['responsive'],
  flexGrow: ['responsive'],
  flexShrink: ['responsive'],
  flexWrap: ['responsive'],
  float: ['responsive'],
  fontFamily: ['responsive'],
  fontSize: ['responsive'],
  fontSmoothing: ['responsive'],
  fontStyle: ['responsive'],
  fontWeight: ['responsive', 'hover', 'focus'],
  height: ['responsive'],
  inset: ['responsive'],
  justifyContent: ['responsive'],
  letterSpacing: ['responsive'],
  lineHeight: ['responsive'],
  listStylePosition: ['responsive'],
  listStyleType: ['responsive'],
  margin: ['responsive'],
  maxHeight: ['responsive'],
  maxWidth: ['responsive'],
  minHeight: ['responsive'],
  minWidth: ['responsive'],
  objectFit: ['responsive'],
  objectPosition: ['responsive'],
  opacity: ['responsive'],
  order: ['responsive'],
  outline: ['responsive', 'focus'],
  overflow: ['responsive'],
  padding: ['responsive'],
  pointerEvents: ['responsive'],
  position: ['responsive'],
  resize: ['responsive'],
  stroke: ['responsive'],
  tableLayout: ['responsive'],
  textAlign: ['responsive'],
  textColor: ['responsive', 'hover', 'focus'],
  textDecoration: ['responsive', 'hover', 'focus'],
  textTransform: ['responsive'],
  userSelect: ['responsive'],
  verticalAlign: ['responsive'],
  visibility: ['responsive'],
  whitespace: ['responsive'],
  width: ['responsive'],
  wordBreak: ['responsive'],
  zIndex: ['responsive'],
}

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
    'xs': '576px',
    'sm': '736px',
    'md': '980px',
    'lg': '1280px',
    'xl': '1690px',
    'tablet': '576px',
    'laptop': '992px',
    'desktop': '1200px',
  },
}
