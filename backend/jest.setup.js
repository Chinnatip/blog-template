// jest.setup.js
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

let prisma; // Define prisma in the setup file scope

beforeAll(() => {
  console.log('Resetting and seeding test database...');
  execSync('npx prisma migrate reset --force --skip-seed', { stdio: 'inherit' });
  execSync('npx ts-node prisma/testSeed.ts', { stdio: 'inherit' });

  // Initialize Prisma Client after migrations
  prisma = new PrismaClient();
});

afterAll(async () => {
  console.log('Disconnecting Prisma Client...');
  await prisma.$disconnect();
});