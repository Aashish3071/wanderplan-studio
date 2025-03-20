import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findFirst();

  if (!existingUser) {
    console.log('No users found. Please create a user first.');
    return;
  }

  const trip = await prisma.trip.findFirst({
    where: { userId: existingUser.id },
  });

  if (!trip) {
    console.log('Creating a test trip...');
    const newTrip = await prisma.trip.create({
      data: {
        title: 'Test Trip',
        description: 'A test trip for API testing',
        destination: 'Test City, Test Country',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'PLANNING',
        userId: existingUser.id,
      },
    });

    console.log('Created test trip:', newTrip);

    const itineraryDay = await prisma.itineraryDay.create({
      data: {
        tripId: newTrip.id,
        date: new Date(),
        notes: 'Test day',
      },
    });

    console.log('Created test itinerary day:', itineraryDay);

    // Create a test activity
    const activity = await prisma.activity.create({
      data: {
        title: 'Visit Museum',
        itineraryDayId: itineraryDay.id,
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
        type: 'ACTIVITY',
        description: 'Visit the local museum',
      },
    });

    console.log('Created test activity:', activity);

    // Create a test place
    const place = await prisma.place.create({
      data: {
        name: 'Test Museum',
        type: 'MUSEUM',
        description: 'A test museum for API testing',
        createdBy: existingUser.id,
      },
    });

    console.log('Created test place:', place);
  } else {
    console.log('Using existing trip:', trip);

    const existingDay = await prisma.itineraryDay.findFirst({
      where: { tripId: trip.id },
    });

    if (!existingDay) {
      const itineraryDay = await prisma.itineraryDay.create({
        data: {
          tripId: trip.id,
          date: new Date(),
          notes: 'Test day',
        },
      });

      console.log('Created test itinerary day:', itineraryDay);

      // Create a test activity
      const activity = await prisma.activity.create({
        data: {
          title: 'Visit Museum',
          itineraryDayId: itineraryDay.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
          type: 'ACTIVITY',
          description: 'Visit the local museum',
        },
      });

      console.log('Created test activity:', activity);
    } else {
      console.log('Existing itinerary day found:', existingDay);

      const existingActivity = await prisma.activity.findFirst({
        where: { itineraryDayId: existingDay.id },
      });

      if (!existingActivity) {
        const activity = await prisma.activity.create({
          data: {
            title: 'Visit Museum',
            itineraryDayId: existingDay.id,
            startTime: new Date(),
            endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
            type: 'ACTIVITY',
            description: 'Visit the local museum',
          },
        });

        console.log('Created test activity:', activity);
      } else {
        console.log('Existing activity found:', existingActivity);
      }
    }

    const existingPlace = await prisma.place.findFirst({
      where: { createdBy: existingUser.id },
    });

    if (!existingPlace) {
      const place = await prisma.place.create({
        data: {
          name: 'Test Museum',
          type: 'MUSEUM',
          description: 'A test museum for API testing',
          createdBy: existingUser.id,
        },
      });

      console.log('Created test place:', place);
    } else {
      console.log('Existing place found:', existingPlace);
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
