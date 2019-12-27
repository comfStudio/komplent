module.exports = ({ file, options, env }) => ({
    plugins: {
        'postcss-easy-import': {},
        tailwindcss: {},
        '@fullhuman/postcss-purgecss':
            env === 'development'
                ? {
                      content: [
                        './pages/**/*.{js,jsx,ts,tsx}',
                        './components/**/*.{js,jsx,ts,tsx}',
                          // etc.
                      ],
                      // Include any special characters you're using in this regular expression
                      defaultExtractor: content =>
                        content.match(/[A-Za-z0-9-_:!/]+/g) || [],
                  }
                : false,
        autoprefixer: {},
        cssnano:
            env === 'development'
                ? {
                      preset: 'default',
                  }
                : false,
    },
})
