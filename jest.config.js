const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

const aliases = pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' } )

delete aliases['^@assets/(.*)$']

module.exports = {
  preset: 'ts-jest',
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testEnvironment: 'node',
  testMatch: null,
  testRegex: '/tests/.*\\.test.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|svg?sprite|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js",
    ...aliases,
  },
  setupFiles: ['<rootDir>/__tests__/setupTests.js'],
  collectCoverage: false,
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}', 
    'server/**/*.{ts,tsx}', 
    'store/**/*.{ts,tsx}'
  ],
  globals: {
    'ts-jest': {
      babelConfig: true,
      tsConfig: "tsconfig.test.json"
    }
  }
};