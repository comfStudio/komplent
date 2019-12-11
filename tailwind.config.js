const { colors } = require('tailwindcss/defaultTheme')
let { variants } = require('tailwindcss/defaultConfig')

let additional_variants = ['important']

Object.entries(variants).forEach(([k, v]) => {
    variants[k] = [...additional_variants, ...v]
})

module.exports = {
    theme: {
        colors: {
            primary: '#f65c77',
            secondary: {
                default: '#494949',
                light: '#8e8e93',
            },
            tertiary: {
                default: '#ece8d9',
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
        extend: {},
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
