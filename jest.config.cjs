module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^(.*)\\?raw$': '<rootDir>/src/__mocks__/raw.js'
  },
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 90,
      statements: 90
    }
  }
}
