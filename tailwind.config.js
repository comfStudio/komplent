const { colors } = require('tailwindcss/defaultTheme')
let { variants } = require('tailwindcss/defaultConfig')

let additional_variants = ['important']

Object.entries(variants).forEach(([k, v]) => {
    variants[k] = [...additional_variants, ...v]
})

module.exports = {
    theme: {
        colors: {
            primary: '#eb425e',
            secondary: {
                default: '#494949',
                light: '#8e8e93',
            },
            tertiary: {
                default: '#afafaf',
                light: '#8e8e93',
            },
            success: {
                default: '#5ea83e',
                light: '#edfae1',
            },
            info: {
                default: '#34c3ff',
                light: '#e9f5fe',
            },
            warning: {
                default: '#eb6331',
                light: '#fff9e6',
            },
            error: {
                default: '#f7635c',
                light: '#fde9ef',
            },
            red: '#f7635c',
            orange: '#eb6331',
            yellow: '#ffec5e',
            green: '#5ea83e',
            cyan: '#00b5ad',
            blue: '#34c3ff',
            violet: '#9c27b0',
            ...colors,
        },
        extend: {
            colors: {
                gray: {
                  '100': '#e1e1e1',
                  '200': '#c8c8c8',
                  '300': '#afafaf',
                  '400': '#969696',
                  '500': '#7d7d7d',
                  '600': '#646464',
                  '700': '#4b4b4b',
                  '800': '#323232',
                  '900': '#191919',
                }
              }
        },
    },
    variants: variants,
    corePlugins: {
        container: false
      },
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
        function ({ addComponents }) {
            addComponents({
              '.container': {
                maxWidth: '100%',
                '@screen sm': {
                  maxWidth: '736px',
                },
                '@screen md': {
                  maxWidth: '980px',
                },
                '@screen lg': {
                  maxWidth: '1280px',
                },
                '@screen xl': {
                  maxWidth: '1690px',
                },
              }
            })
        },
    ],
    screens: {
        bs: '0px',
        xs: '576px',
        sm: '736px',
        md: '980px',
        lg: '1280px',
        xl: '1690px',
        tablet: '640px',
        laptop: '1024px',
        desktop: '1280px',
    },
}
