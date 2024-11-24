import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding test database...');

  // Hash password for the test user
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create or update superadmin
  await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {}, // No updates if superadmin exists
    create: {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      adminRole: true, // Mark this user as admin
    },
  });

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {}, // No updates if the user already exists
    create: {
      name: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword,
    },
  });

  console.log(`User seeded: ${user.email}`);

  // Create sample posts for the user
  const posts = [
    {
      title: 'Test Post 1',
      content: 'This is the content of test post 1.',
      published: true,
      authorId: user.id,
    },
    {
      title: 'Test Post 2',
      content: 'This is the content of test post 2.',
      published: false,
      authorId: user.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.create({ data: post });
  }

  console.log('Posts seeded.');

  console.log('Seeding completed.');
}

seed()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
