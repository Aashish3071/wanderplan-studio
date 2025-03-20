import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

// Import mock data
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

// GET: Fetch a specific trip by ID
router.get(async (req, res) => {
  try {
    const { id } = req.query;
    const trip = mockTrips.find((trip) => trip.id === id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error('Error fetching trip:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch trip',
      data: null,
    });
  }
});

// PUT: Update a specific trip
router.put(async (req, res) => {
  try {
    const { id } = req.query;
    const tripData = req.body;

    // Find trip index
    const tripIndex = mockTrips.findIndex((trip) => trip.id === id);

    if (tripIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found',
        data: null,
      });
    }

    // Update trip data
    const updatedTrip = {
      ...mockTrips[tripIndex],
      ...tripData,
      updatedAt: new Date().toISOString(),
    };

    // In a real app we would save to the database

    return res.status(200).json({
      success: true,
      data: updatedTrip,
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update trip',
      data: null,
    });
  }
});

// DELETE: Delete a specific trip
router.delete(async (req, res) => {
  try {
    const { id } = req.query;
    const tripIndex = mockTrips.findIndex((trip) => trip.id === id);

    if (tripIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found',
      });
    }

    // In a real app we would remove from the database

    return res.status(200).json({
      success: true,
      data: { message: 'Trip deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete trip',
    });
  }
});

export default router.handler();
