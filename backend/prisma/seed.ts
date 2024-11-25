import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { postExport } from './postExport'

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
        create: postExport
      },
    },
  });

  console.log(`User upserted: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
