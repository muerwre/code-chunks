module.exports = {
  testURL: 'http://localhost/',
  setupFiles: [
    '<rootDir>/test/test-shim.js',
    '<rootDir>/test/test-setup.js'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/src/utils/test/test-preprocessor.js'
  },
  testMatch: [
    '**/src/**/*.test.(ts|tsx|js)'
  ],
  globals: {
    'ts-jest': {
      useBabelrc: true,
      tsConfig: 'tsconfig.json'
    },
  },
  collectCoverage: false,
  moduleNameMapper: {
    '^.+\\.s?css': 'identity-obj-proxy',
    '^\\~/(.*)$': '<rootDir>/src/$1',
  },
  modulePaths: ['src'],
};
