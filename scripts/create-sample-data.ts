import { PrismaClient, TripStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleData() {
  try {
    console.log('Creating sample data...');

    // Test user ID
    const userId = 'cm8gypc5m00005jxkexesivnk';

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error('Test user not found!');
      return;
    }

    console.log('Creating sample trip...');

    // Create a sample trip
    const trip = await prisma.trip.create({
      data: {
        title: 'Sample Trip',
        description: 'A sample trip created via script',
        destination: 'Sample City',
        startDate: new Date('2023-07-01'),
        endDate: new Date('2023-07-07'),
        status: TripStatus.PLANNING,
        isPublic: true,
        budget: 1500,
        userId,
      },
    });

    console.log('Trip created:', trip);

    // Create itinerary days
    console.log('Creating itinerary days...');

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date('2023-07-01');
      date.setDate(date.getDate() + i);

      const day = await prisma.itineraryDay.create({
        data: {
          date,
          notes: `Day ${i + 1} notes`,
          tripId: trip.id,
        },
      });

      days.push(day);
      console.log(`Day ${i + 1} created:`, day.id);
    }

    // Create some activities
    console.log('Creating activities...');

    const activities = [];
    for (const day of days) {
      // Morning activity
      const morningActivity = await prisma.activity.create({
        data: {
          title: `Morning activity on ${day.date.toLocaleDateString()}`,
          description: 'A sample morning activity',
          startTime: new Date(day.date.setHours(9, 0, 0, 0)),
          endTime: new Date(day.date.setHours(12, 0, 0, 0)),
          type: 'ACTIVITY',
          cost: 50,
          itineraryDayId: day.id,
        },
      });

      // Afternoon activity
      const afternoonActivity = await prisma.activity.create({
        data: {
          title: `Afternoon activity on ${day.date.toLocaleDateString()}`,
          description: 'A sample afternoon activity',
          startTime: new Date(day.date.setHours(14, 0, 0, 0)),
          endTime: new Date(day.date.setHours(17, 0, 0, 0)),
          type: 'ACTIVITY',
          cost: 75,
          itineraryDayId: day.id,
        },
      });

      activities.push(morningActivity, afternoonActivity);
      console.log(`Activities created for day ${day.id}`);
    }

    console.log('Sample data creation completed.');
    console.log('Created 1 trip, 7 days, and 14 activities.');
  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
createSampleData()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
