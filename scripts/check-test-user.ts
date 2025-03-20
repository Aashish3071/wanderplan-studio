import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTestUser() {
  try {
    console.log('Checking for test user in the database...');

    // Find the test user
    const user = await prisma.user.findUnique({
      where: { id: 'cm8gypc5m00005jxkexesivnk' },
    });

    if (user) {
      console.log('Test user found:');
      console.log(JSON.stringify(user, null, 2));

      // Count trips for this user
      const tripsCount = await prisma.trip.count({
        where: { userId: user.id },
      });

      console.log(`User has ${tripsCount} trips.`);

      if (tripsCount > 0) {
        // Get trip details
        const trips = await prisma.trip.findMany({
          where: { userId: user.id },
        });

        console.log('Trip details:');
        console.log(JSON.stringify(trips, null, 2));
      }
    } else {
      console.log('Test user NOT found in the database!');
    }
  } catch (error) {
    console.error('Error checking test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
checkTestUser()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
