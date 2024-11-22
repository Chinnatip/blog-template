const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

module.exports = createJestConfig({
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': '@swc/jest', // Use SWC instead of Babel
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map @/* to ./src/*
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1', // Map @/lib/* to ./src/lib/*
    '^@/components/(.*)$': '<rootDir>/src/app/components/$1', // Map @/components/* to ./src/app/components/*
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
});


// module.exports = {
//   testEnvironment: 'jsdom',
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
//   transform: {
//     '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
//   },
//   testMatch: ['<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'],
// };