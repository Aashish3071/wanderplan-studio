import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('Checking for existing test user...');

    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    if (existingUser) {
      console.log('Test user already exists with ID:', existingUser.id);
      return existingUser;
    }

    // Create new test user
    console.log('Creating test user...');
    const hashedPassword = await hash('password123', 10);

    const newUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      },
    });

    console.log('Test user created with ID:', newUser.id);
    return newUser;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
createTestUser()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
