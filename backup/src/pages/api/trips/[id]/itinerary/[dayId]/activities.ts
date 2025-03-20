import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]';
import { createRouter } from 'next-connect';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Add user property to NextApiRequest
declare module 'next' {
  interface NextApiRequest {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const router = createRouter<NextApiRequest, NextApiResponse>();

// Authentication middleware
router.use(async (req, res, next) => {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  req.user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
  
  return next();
});

// Middleware to check if user has access to the trip
router.use(async (req, res, next) => {
  const tripId = req.query.id as string;
  const userId = req.user!.id;
  
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
    include: {
      collaborators: {
        where: {
          userId,
        },
        select: {
          role: true,
        },
      },
    },
  });
  
  if (!trip) {
    return res.status(403).json({ error: 'You do not have access to this trip' });
  }
  
  // Check write permissions for non-GET methods
  if (req.method !== 'GET') {
    const isOwner = trip.userId === userId;
    const hasEditPermission = trip.collaborators.length > 0 && 
      (trip.collaborators[0].role === 'OWNER' || trip.collaborators[0].role === 'EDITOR');
    
    if (!isOwner && !hasEditPermission) {
      return res.status(403).json({ error: 'You do not have permission to modify this itinerary' });
    }
  }
  
  // Validate day belongs to the trip
  const dayId = req.query.dayId as string;
  const day = await prisma.itineraryDay.findFirst({
    where: {
      id: dayId,
      tripId,
    },
  });
  
  if (!day) {
    return res.status(404).json({ error: 'Day not found in this trip itinerary' });
  }
  
  return next();
});

// GET: Get activities for a day
router.get(async (req, res) => {
  try {
    const dayId = req.query.dayId as string;
    
    // Fetch activities
    const activities = await prisma.activity.findMany({
      where: { itineraryDayId: dayId },
      orderBy: { startTime: 'asc' },
      include: {
        place: true,
      },
    });
    
    return res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// POST: Add activity to a day
router.post(async (req, res) => {
  try {
    const dayId = req.query.dayId as string;
    
    // Validation schema
    const activitySchema = z.object({
      title: z.string().min(1, 'Title is required'),
      startTime: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: 'Invalid start time format',
      }),
      endTime: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: 'Invalid end time format',
      }),
      description: z.string().optional(),
      placeId: z.string().optional(),
      location: z.object({
        latitude: z.number(),
        longitude: z.number(),
        address: z.string().optional(),
        name: z.string().optional(),
      }).optional(),
      type: z.enum(['TRANSPORT', 'ACCOMMODATION', 'ACTIVITY', 'FOOD', 'OTHER']),
      cost: z.number().min(0).optional(),
      transportType: z.enum(['WALK', 'TRANSIT', 'CAR', 'BIKE', 'TAXI', 'PLANE', 'TRAIN', 'BUS', 'BOAT', 'OTHER']).optional(),
    })
    .refine(data => 
      !(data.endTime && data.startTime && new Date(data.endTime) <= new Date(data.startTime)), {
      message: 'End time must be after start time',
      path: ['endTime'],
    });
    
    // Validate request body
    const validationResult = activitySchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid activity data',
        details: validationResult.error.format(),
      });
    }
    
    const {
      title,
      startTime,
      endTime,
      description,
      placeId,
      location,
      type,
      cost,
      transportType,
    } = validationResult.data;
    
    // Create activity
    const activity = await prisma.activity.create({
      data: {
        itineraryDayId: dayId,
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description: description || '',
        placeId,
        location: location ? {
          create: {
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address || '',
            name: location.name || '',
          }
        } : undefined,
        type,
        cost: cost || 0,
        transportType,
      },
      include: {
        place: true,
        location: true,
      },
    });
    
    return res.status(201).json({ success: true, data: activity });
  } catch (error) {
    console.error('Error adding activity:', error);
    return res.status(500).json({ error: 'Failed to add activity' });
  }
});

// PATCH: Update an activity
router.patch(async (req, res) => {
  try {
    const dayId = req.query.dayId as string;
    const { activityId } = req.query;
    
    if (!activityId) {
      return res.status(400).json({ error: 'Activity ID is required' });
    }
    
    // Check if activity exists and belongs to the day
    const existingActivity = await prisma.activity.findFirst({
      where: {
        id: activityId as string,
        itineraryDayId: dayId,
      },
    });
    
    if (!existingActivity) {
      return res.status(404).json({ error: 'Activity not found in this day' });
    }
    
    // Validation schema
    const activitySchema = z.object({
      title: z.string().min(1, 'Title is required').optional(),
      startTime: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: 'Invalid start time format',
      }).optional(),
      endTime: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: 'Invalid end time format',
      }).optional(),
      description: z.string().optional(),
      placeId: z.string().optional().nullable(),
      location: z.object({
        latitude: z.number(),
        longitude: z.number(),
        address: z.string().optional(),
        name: z.string().optional(),
      }).optional().nullable(),
      type: z.enum(['TRANSPORT', 'ACCOMMODATION', 'ACTIVITY', 'FOOD', 'OTHER']).optional(),
      cost: z.number().min(0).optional(),
      transportType: z.enum(['WALK', 'TRANSIT', 'CAR', 'BIKE', 'TAXI', 'PLANE', 'TRAIN', 'BUS', 'BOAT', 'OTHER']).optional().nullable(),
    })
    .refine(data => 
      !(data.endTime && data.startTime && new Date(data.endTime) <= new Date(data.startTime)), {
      message: 'End time must be after start time',
      path: ['endTime'],
    });
    
    // Validate request body
    const validationResult = activitySchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid activity data',
        details: validationResult.error.format(),
      });
    }
    
    const {
      title,
      startTime,
      endTime,
      description,
      placeId,
      location,
      type,
      cost,
      transportType,
    } = validationResult.data;
    
    // Update activity
    const activity = await prisma.activity.update({
      where: {
        id: activityId as string,
      },
      data: {
        title,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        description,
        placeId,
        location: location ? {
          upsert: {
            create: {
              latitude: location.latitude,
              longitude: location.longitude,
              address: location.address || '',
              name: location.name || '',
            },
            update: {
              latitude: location.latitude,
              longitude: location.longitude,
              address: location.address || '',
              name: location.name || '',
            },
          },
        } : undefined,
        type,
        cost,
        transportType,
      },
      include: {
        place: true,
        location: true,
      },
    });
    
    return res.status(200).json({ success: true, data: activity });
  } catch (error) {
    console.error('Error updating activity:', error);
    return res.status(500).json({ error: 'Failed to update activity' });
  }
});

// DELETE: Remove an activity
router.delete(async (req, res) => {
  try {
    const dayId = req.query.dayId as string;
    const { activityId } = req.query;
    
    if (!activityId) {
      return res.status(400).json({ error: 'Activity ID is required' });
    }
    
    // Check if activity exists and belongs to the day
    const existingActivity = await prisma.activity.findFirst({
      where: {
        id: activityId as string,
        itineraryDayId: dayId,
      },
    });
    
    if (!existingActivity) {
      return res.status(404).json({ error: 'Activity not found in this day' });
    }
    
    // Delete activity
    await prisma.activity.delete({
      where: {
        id: activityId as string,
      },
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error removing activity:', error);
    return res.status(500).json({ error: 'Failed to remove activity' });
  }
});

export default router.handler(); 