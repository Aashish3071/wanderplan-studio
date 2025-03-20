import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { createRouter } from 'next-connect';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { TripStatus } from '@prisma/client';

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
  // Check for test mode headers from middleware
  const isTestMode = req.headers['x-test-mode'] === 'true';
  const testUserId = req.headers['x-test-user-id'] as string;

  if (isTestMode && testUserId) {
    console.log('Using test user for API call:', testUserId);
    req.user = {
      id: testUserId,
      name: 'Test User',
      email: 'test@example.com',
      image: null,
    };
    return next();
  }

  // Regular authentication flow
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = session.user;
  return next();
});

// GET: List all trips for the current user
router.get(async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('GET trips - User ID:', userId);

    const { status, limit = 10, offset = 0 } = req.query;

    const where = {
      OR: [
        // Trips owned by user
        { userId },
        // Trips where user is a collaborator
        {
          collaborators: {
            some: {
              userId,
            },
          },
        },
      ],
      ...(status ? { status: status as TripStatus } : {}),
    };

    console.log('GET trips - Query:', JSON.stringify(where));

    try {
      const [trips, count] = await Promise.all([
        prisma.trip.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            collaborators: {
              select: {
                userId: true,
                role: true,
                user: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: {
            startDate: 'asc',
          },
          skip: Number(offset),
          take: Number(limit),
        }),
        prisma.trip.count({ where }),
      ]);

      console.log('GET trips - Found:', count);

      return res.status(200).json({
        success: true,
        data: trips,
        meta: {
          total: count,
          offset: Number(offset),
          limit: Number(limit),
        },
      });
    } catch (prismaError) {
      console.error('Prisma error in GET trips:', prismaError);
      throw prismaError;
    }
  } catch (error) {
    console.error('Error fetching trips:', error);
    return res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// POST: Create a new trip
router.post(async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('POST trip - User ID:', userId);
    console.log('POST trip - Request body:', JSON.stringify(req.body));

    // Validation schema
    const tripSchema = z.object({
      title: z.string().min(3, 'Title must be at least 3 characters'),
      description: z.string().optional(),
      destination: z.string().min(2, 'Destination must be at least 2 characters'),
      startDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
        message: 'Invalid start date format',
      }),
      endDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
        message: 'Invalid end date format',
      }),
      budget: z.number().optional(),
      isPublic: z.boolean().optional(),
    });

    // Validate request body
    const validationResult = tripSchema.safeParse(req.body);

    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
      return res.status(400).json({
        success: false,
        error: 'Invalid trip data',
        details: validationResult.error.format(),
      });
    }

    const data = validationResult.data;
    console.log('POST trip - Validated data:', JSON.stringify(data));

    try {
      // Create new trip
      const trip = await prisma.trip.create({
        data: {
          title: data.title,
          description: data.description,
          destination: data.destination,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          budget: data.budget,
          isPublic: data.isPublic ?? false,
          status: 'PLANNING',
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      console.log('POST trip - Created trip with ID:', trip.id);

      return res.status(201).json({ success: true, data: trip });
    } catch (prismaError) {
      console.error('Prisma error in POST trip:', prismaError);
      throw prismaError;
    }
  } catch (error) {
    console.error('Error creating trip:', error);
    return res.status(500).json({ error: 'Failed to create trip' });
  }
});

export default router.handler();
