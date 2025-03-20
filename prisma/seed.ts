import { PrismaClient, TripStatus, ActivityType, TransportType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.review.deleteMany(),
    prisma.activity.deleteMany(),
    prisma.itineraryDay.deleteMany(),
    prisma.collaboration.deleteMany(),
    prisma.trip.deleteMany(),
    prisma.location.deleteMany(),
    prisma.place.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 10),
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
  });

  // Create locations
  const louvreLocation = await prisma.location.create({
    data: {
      latitude: 48.8606,
      longitude: 2.3376,
      address: 'Rue de Rivoli, 75001 Paris, France',
      name: 'Louvre Museum',
    },
  });

  const eiffelLocation = await prisma.location.create({
    data: {
      latitude: 48.8584,
      longitude: 2.2945,
      address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
      name: 'Eiffel Tower',
    },
  });

  const julesVerneLocation = await prisma.location.create({
    data: {
      latitude: 48.8583,
      longitude: 2.2944,
      address: 'Eiffel Tower, Avenue Gustave Eiffel, 75007 Paris, France',
      name: 'Le Jules Verne',
    },
  });

  // Create places
  const louvre = await prisma.place.create({
    data: {
      name: 'Louvre Museum',
      description: "The world's largest art museum and a historic monument in Paris, France.",
      type: 'MUSEUM',
      address: 'Rue de Rivoli, 75001 Paris, France',
      website: 'https://www.louvre.fr/en',
      phone: '+33 1 40 20 53 17',
      openingHours: '9:00 AM - 6:00 PM',
      priceRange: 'MODERATE',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a',
      createdBy: user1.id,
      locationId: louvreLocation.id,
    },
  });

  const eiffelTower = await prisma.place.create({
    data: {
      name: 'Eiffel Tower',
      description: 'A wrought-iron lattice tower on the Champ de Mars in Paris, France.',
      type: 'ATTRACTION',
      address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
      website: 'https://www.toureiffel.paris/en',
      phone: '+33 8 92 70 12 39',
      openingHours: '9:00 AM - 12:45 AM',
      priceRange: 'MODERATE',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f',
      createdBy: user1.id,
      locationId: eiffelLocation.id,
    },
  });

  const julesVerne = await prisma.place.create({
    data: {
      name: 'Le Jules Verne',
      description: 'Fine dining restaurant located on the second floor of the Eiffel Tower.',
      type: 'RESTAURANT',
      address: 'Eiffel Tower, Avenue Gustave Eiffel, 75007 Paris, France',
      website: 'https://www.restaurants-toureiffel.com/en/jules-verne-restaurant.html',
      phone: '+33 1 45 55 61 44',
      openingHours: '12:00 PM - 1:30 PM, 7:00 PM - 9:30 PM',
      priceRange: 'VERY_EXPENSIVE',
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1550966871-5740ffbd9118',
      createdBy: user1.id,
      locationId: julesVerneLocation.id,
    },
  });

  // Create trip
  const parisTrip = await prisma.trip.create({
    data: {
      title: 'Paris Getaway',
      description: 'A weekend trip to explore the beautiful city of Paris.',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-03'),
      status: TripStatus.CONFIRMED,
      isPublic: true,
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      userId: user1.id,
    },
  });

  // Add collaborator
  await prisma.collaboration.create({
    data: {
      userId: user2.id,
      tripId: parisTrip.id,
      role: 'EDITOR',
    },
  });

  // Create itinerary days
  const day1 = await prisma.itineraryDay.create({
    data: {
      date: new Date('2025-06-01'),
      tripId: parisTrip.id,
      notes: 'Art and Culture Day',
    },
  });

  const day2 = await prisma.itineraryDay.create({
    data: {
      date: new Date('2025-06-02'),
      tripId: parisTrip.id,
      notes: 'Iconic Landmarks Day',
    },
  });

  const day3 = await prisma.itineraryDay.create({
    data: {
      date: new Date('2025-06-03'),
      tripId: parisTrip.id,
      notes: 'Shopping and Departure Day',
    },
  });

  // Create activities
  const louvreVisit = await prisma.activity.create({
    data: {
      title: 'Visit Louvre Museum',
      description: "Explore the world's largest art museum.",
      startTime: new Date('2025-06-01T10:00:00Z'),
      endTime: new Date('2025-06-01T14:00:00Z'),
      type: ActivityType.ACTIVITY,
      cost: 15,
      itineraryDayId: day1.id,
      placeId: louvre.id,
    },
  });

  const eiffelVisit = await prisma.activity.create({
    data: {
      title: 'Eiffel Tower Experience',
      description: 'Visit the iconic Eiffel Tower and enjoy the view from the top.',
      startTime: new Date('2025-06-02T11:00:00Z'),
      endTime: new Date('2025-06-02T14:00:00Z'),
      type: ActivityType.ACTIVITY,
      cost: 25,
      itineraryDayId: day2.id,
      placeId: eiffelTower.id,
    },
  });

  const dinner = await prisma.activity.create({
    data: {
      title: 'Dinner at Jules Verne',
      description: 'Fine dining experience at the Eiffel Tower.',
      startTime: new Date('2025-06-02T19:00:00Z'),
      endTime: new Date('2025-06-02T21:30:00Z'),
      type: ActivityType.FOOD,
      cost: 200,
      itineraryDayId: day2.id,
      placeId: julesVerne.id,
    },
  });

  // Create reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'An absolute masterpiece of a museum. Plan to spend at least half a day here.',
      userId: user1.id,
      placeId: louvre.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4.5,
      comment: 'Iconic view of Paris, but can be very crowded. Book tickets in advance!',
      userId: user1.id,
      placeId: eiffelTower.id,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
