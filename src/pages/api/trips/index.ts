import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

// Sample mock data
const mockTrips = [
  {
    id: '1',
    title: 'Paris Getaway',
    description: 'A romantic weekend in Paris',
    destination: 'Paris, France',
    startDate: '2023-12-15T00:00:00.000Z',
    endDate: '2023-12-20T00:00:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    isPublic: true,
    status: 'PLANNING',
    userId: 'user1',
    createdAt: '2023-11-01T10:30:00.000Z',
    updatedAt: '2023-11-10T15:45:00.000Z',
  },
  {
    id: '2',
    title: 'Tokyo Adventure',
    description: 'Exploring the vibrant city of Tokyo',
    destination: 'Tokyo, Japan',
    startDate: '2024-03-10T00:00:00.000Z',
    endDate: '2024-03-20T00:00:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    isPublic: true,
    status: 'PLANNING',
    userId: 'user1',
    createdAt: '2023-10-15T08:20:00.000Z',
    updatedAt: '2023-10-25T12:15:00.000Z',
  },
  {
    id: '3',
    title: 'New York City Trip',
    description: 'Business trip to the Big Apple',
    destination: 'New York City, USA',
    startDate: '2024-01-05T00:00:00.000Z',
    endDate: '2024-01-10T00:00:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    isPublic: false,
    status: 'BOOKED',
    userId: 'user1',
    createdAt: '2023-11-20T14:10:00.000Z',
    updatedAt: '2023-11-22T09:30:00.000Z',
  },
];

// Extend the NextApiRequest type
interface ExtendedRequest extends NextApiRequest {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const router = createRouter<ExtendedRequest, NextApiResponse>();

// Authentication middleware
router.use(async (req, res, next) => {
  // Use test mode to bypass auth checks in development
  req.user = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    image: null,
  };
  return next();
});

// GET: List all trips for the current user
router.get(async (req, res) => {
  try {
    const { status } = req.query;

    // Filter trips if status is provided
    let filteredTrips = [...mockTrips];
    if (status && status !== 'all') {
      filteredTrips = mockTrips.filter((trip) => trip.status === status);
    }

    return res.status(200).json({
      success: true,
      data: filteredTrips,
      meta: {
        total: filteredTrips.length,
      },
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch trips',
      data: [],
    });
  }
});

// POST: Create a new trip
router.post(async (req, res) => {
  try {
    const userId = req.user.id;
    const tripData = req.body;

    // Create a new mock trip
    const newTrip = {
      id: Date.now().toString(),
      ...tripData,
      userId,
      status: tripData.status || 'PLANNING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return res.status(201).json({
      success: true,
      data: newTrip,
    });
  } catch (error) {
    console.error('Error creating trip:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create trip',
      data: null,
    });
  }
});

export default router.handler();
