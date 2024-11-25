import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);

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

  // Create or update superadmin
  await prisma.user.upsert({
    where: { email: 'writer@example.com' },
    update: {},
    create: {
      name: 'Writer doppio',
      email: 'writer@example.com',
      password: hashedPassword,
    },
  });

  // Upsert the user
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {}, // No updates to the user if they already exist
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      adminRole: true,
      posts: {
        create: [
          {
            title: 'First Post',
            content: 'This is the content of the first post.',
            published: true,
          },
          {
            title: 'Second Post',
            content: 'This is the content of the second post.',
            published: false,
          },
        ],
      },
    },
  });

  console.log(`User upserted: ${user.email}`);

  // Add posts if the user already exists
  if (user.id) {
    const existingPosts = await prisma.post.findMany({
      where: { authorId: user.id },
    });

    if (existingPosts.length === 0) {
      console.log('Adding posts for existing user...');
      await prisma.post.createMany({
        data: [
          {
            title: 'First Post',
            content: 'This is the content of the first post.',
            published: true,
            authorId: user.id,
          },
          {
            title: 'Second Post',
            content: 'This is the content of the second post.',
            published: false,
            authorId: user.id,
          },
        ],
      });
      console.log('Posts added.');
    } else {
      console.log('Posts already exist for the user.');
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
