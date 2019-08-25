/* eslint-disable @typescript-eslint/no-var-requires */
const packagejson = require('./package.json')

const withPlugins = require('next-compose-plugins');
const { IgnorePlugin, ProvidePlugin } = require('webpack');
const { PHASE_PRODUCTION_BUILD, PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } = require('next-server/constants');

const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withSass = require('@zeit/next-sass');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const nextRuntimeDotenv = require('next-runtime-dotenv');
const createResolver = require('postcss-import-webpack-resolver');
const withOptimizedImages = require('next-optimized-images');

const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

/* eslint-enable @typescript-eslint/no-var-requires */

let RSUITE_THEME = "./assets/styles/rsuite.less"

const THEME_VARIABLES = lessToJS(
    fs.readFileSync(
      path.resolve(__dirname, RSUITE_THEME),
      'utf8',
    ),
);

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
    require.extensions['.less'] = file => {}
  }

let aliases = {}
Object.entries((packagejson._moduleAliases  || {})).forEach(([k, v]) => {aliases[k] =  path.resolve(__dirname, v)})


const withConfig = nextRuntimeDotenv({
    public: ['API_URL', 'API_KEY'],
    server: [
        'GITHUB_TOKEN'
      ]
});

module.exports = withConfig(
  withPlugins([
      [withOptimizedImages, {
        // svgSpriteLoader: {
        //   spriteModule: require.resolve('svg-sprite-loader/runtime/browser-sprite.build'),                                                                                      
        //   symbolModule: require.resolve('svg-baker-runtime/browser-symbol'),
        // }
      }],
      [withSass, {
        postcssLoaderOptions: {
          config: {
            ctx: {
              "postcss-import": {
                resolve: createResolver({
                  // use aliases defined in config
                  alias: aliases,
                  // include where to look for modules
                        modules: ['.', 'node_modules']
                      })
                    }
                    //   theme: JSON.stringify(process.env.REACT_APP_THEME)
                  }
                }
              }
            }],
      [withCSS, {
        cssLoaderOptions: {
          importLoaders: 1 
        }
      }],
      [withLess, {
              lessLoaderOptions: {
                  javascriptEnabled: true,
                  modifyVars: THEME_VARIABLES, // Add modifyVars property
                  localIdentName: '[local]___[hash:base64:5]',
              }
            }],
      [withBundleAnalyzer]
    ],
    {
		analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
		analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
		bundleAnalyzerConfig: {
			server: {
				analyzerMode: 'static',
				reportFilename: '../bundles/server.html',
			},
			browser: {
				analyzerMode: 'static',
				reportFilename: '../bundles/client.html',
			},
        },
        distDir: 'build',
        webpack: (config, { dev, isServer }) => {
            const prod = !dev;
        
            //config.plugins.push(new Dotenv({ path: './public.env' }));
            config.plugins.push(new IgnorePlugin(/^\.\/locale$/, /moment$/));
            Object.assign(config.resolve.alias, aliases)

            // if (dev) {
            //   config.module.rules.push({
            //     test: /\.(jsx?|gql|graphql)$/,
            //     loader: 'eslint-loader',
            //     exclude: ['/node_modules/', '/.next/', '/build/', '/scripts/'],
            //     enforce: 'pre'
            //   });
            // }

            return config
        },
        [PHASE_PRODUCTION_BUILD]: {},
        [PHASE_PRODUCTION_BUILD + PHASE_PRODUCTION_SERVER]: {},
        ['!' + PHASE_DEVELOPMENT_SERVER]: {},
	}),
);