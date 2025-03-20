import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { createRouter } from 'next-connect';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  req.user = session.user;
  return next();
});

// GET: List all itinerary days for a trip
router.get(async (req, res) => {
  try {
    const { tripId } = req.query;
    const userId = req.user.id;

    if (!tripId || typeof tripId !== 'string') {
      return res.status(400).json({ success: false, error: 'Trip ID is required' });
    }

    // Check if the trip exists and user has access
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { userId },
          {
            collaborators: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    });

    if (!trip) {
      return res
        .status(404)
        .json({ success: false, error: 'Trip not found or you do not have access' });
    }

    // Get all itinerary days for the trip
    const itineraryDays = await prisma.itineraryDay.findMany({
      where: {
        tripId,
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        activities: {
          orderBy: {
            startTime: 'asc',
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: itineraryDays,
    });
  } catch (error) {
    console.error('Error fetching itinerary days:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch itinerary days' });
  }
});

// POST: Create a new itinerary day
router.post(async (req, res) => {
  try {
    const userId = req.user.id;

    // Validation schema
    const itineraryDaySchema = z.object({
      tripId: z.string().min(1, 'Trip ID is required'),
      date: z.string().refine((value) => !isNaN(Date.parse(value)), {
        message: 'Invalid date format',
      }),
      notes: z.string().optional(),
    });

    // Validate request body
    const validationResult = itineraryDaySchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid itinerary day data',
        details: validationResult.error.format(),
      });
    }

    const data = validationResult.data;
    const { tripId, date, notes } = data;

    // Check if the trip exists and user has write access
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { userId },
          {
            collaborators: {
              some: {
                userId,
                role: {
                  in: ['OWNER', 'EDITOR'],
                },
              },
            },
          },
        ],
      },
    });

    if (!trip) {
      return res
        .status(404)
        .json({ success: false, error: 'Trip not found or you do not have write access' });
    }

    // Check if an itinerary day already exists for this date
    const existingDay = await prisma.itineraryDay.findFirst({
      where: {
        tripId,
        date: new Date(date),
      },
    });

    if (existingDay) {
      return res
        .status(400)
        .json({ success: false, error: 'An itinerary day already exists for this date' });
    }

    // Create new itinerary day
    const itineraryDay = await prisma.itineraryDay.create({
      data: {
        tripId,
        date: new Date(date),
        notes: notes,
      },
    });

    return res.status(201).json({ success: true, data: itineraryDay });
  } catch (error) {
    console.error('Error creating itinerary day:', error);
    return res.status(500).json({ success: false, error: 'Failed to create itinerary day' });
  }
});

export default router.handler();
