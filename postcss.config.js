module.exports = ({ file, options, env }) =>(
  {
    plugins: {
      'postcss-import': options['postcss-import'] ? {
        resolve: options['postcss-import'].resolve,
      } : {},
      'tailwindcss': {},
      'autoprefixer': {},
      'postcss-purgecss': env === 'production' ? {
        content: [
          './build/**/*.html',
          './pages/**/*.tsx',
          './components/**/*.tsx',
          // etc.
        ],
        // Include any special characters you're using in this regular expression
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
      } : false,
      'cssnano': env === 'production' ? {
        preset: 'default'
      } : false,
    }
  })