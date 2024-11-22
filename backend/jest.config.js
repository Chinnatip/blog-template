require('dotenv').config({ path: '.env.test' });

module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Optional, if needed
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest', // Use ts-jest for TypeScript files
    },
    moduleFileExtensions: ['ts', 'js'],
    globals: {
      'ts-jest': {
        isolatedModules: true,
      },
    },
};