// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
      '^@auth/(.*)$': '<rootDir>/src/modules/auth/$1',
      '^@transaction/(.*)$': '<rootDir>/src/modules/transaction/$1',
      // Adicione mais mapeamentos conforme necessário
    },
    coverageDirectory: './coverage',
    collectCoverageFrom: ['src/**/*.{ts,js}', '!src/main.ts'],
  };
  