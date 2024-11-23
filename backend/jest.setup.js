// jest.setup.js
require('@testing-library/jest-dom');
const { execSync } = require('child_process');

beforeAll(() => {
  console.log('Resetting and seeding test database...');
  execSync('npx prisma migrate reset --force --skip-seed', { stdio: 'inherit' });
  execSync('npx ts-node prisma/testSeed.ts', { stdio: 'inherit' });
});

afterAll(() => {
  console.log('Tests completed.');
});
