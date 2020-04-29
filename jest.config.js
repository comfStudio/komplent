const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig')

const aliases = pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
})

delete aliases['^@assets/(.*)$']

let jest_config = {
    preset: 'ts-jest/presets/js-with-babel',
    transform: {
        '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg.+|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)(\\?.+)?$':
            '<rootDir>/__tests__/fileTransformer.js',
    },
    snapshotSerializers: ['enzyme-to-json/serializer'],
    testMatch: null,
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^.+\\.svg\\?(sprite|include)(.+)?$': '<rootDir>/__mocks__/svgMock.js',
        '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg.+|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)(\\?.+)\\?(resize|sizes)(.+)?$':
            '<rootDir>/__mocks__/fileResizeMock.js',
        '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg.+|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)(\\?.+)?$':
            '<rootDir>/__mocks__/fileMock.js',
        '^.+\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
        ...aliases,
    },
    setupFiles: ['<rootDir>/__tests__/setupTests.js'],
    collectCoverage: false,
    collectCoverageFrom: [
        'components/**/*.{ts,tsx}',
        'pages/**/*.{ts,tsx}',
        'server/**/*.{ts,tsx}',
        'store/**/*.{ts,tsx}',
    ],
    globals: {
        'ts-jest': {
            diagnostics: false,
            babelConfig: true,
            tsConfig: 'tsconfig.test.json',
        },
    },
}

module.exports = {
    projects: [
        {
            displayName: 'general',
            testRegex: '/__tests__/unit/.*\\.test.(ts|tsx|js)$',
            testEnvironment: 'node',
            ...jest_config,
        },
        // {
        //     displayName: 'server',
        //     testRegex: '/__tests__/.*\\.server.test.(ts|tsx|js)$',
        //     testEnvironment: 'node',
        //     ...jest_config,
        // },
        // {
        //     displayName: 'client',
        //     testRegex: '/__tests__/.*\\.client.test.(ts|tsx|js)$',
        //     testEnvironment: 'jsdom',
        //     ...jest_config,
        // },
    ],
}
