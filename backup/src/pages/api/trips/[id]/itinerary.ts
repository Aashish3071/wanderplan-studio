import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
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
  
  return next();
});

// GET: Get itinerary for a trip
router.get(async (req, res) => {
  try {
    const tripId = req.query.id as string;
    
    // Fetch trip itinerary
    const days = await prisma.itineraryDay.findMany({
      where: { tripId },
      orderBy: { date: 'asc' },
      include: {
        activities: {
          orderBy: { startTime: 'asc' },
          include: {
            place: true,
          },
        },
      },
    });
    
    return res.status(200).json({ success: true, data: days });
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
});

// POST: Add a day to the itinerary
router.post(async (req, res) => {
  try {
    const tripId = req.query.id as string;
    
    // Validation schema
    const daySchema = z.object({
      date: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      }),
      note: z.string().optional(),
    });
    
    // Validate request body
    const validationResult = daySchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid day data',
        details: validationResult.error.format(),
      });
    }
    
    const { date, note } = validationResult.data;
    
    // Check if day already exists
    const existingDay = await prisma.itineraryDay.findFirst({
      where: {
        tripId,
        date: new Date(date),
      },
    });
    
    if (existingDay) {
      return res.status(400).json({ error: 'A day with this date already exists in the itinerary' });
    }
    
    // Create day
    const day = await prisma.itineraryDay.create({
      data: {
        tripId,
        date: new Date(date),
        note: note || '',
      },
    });
    
    return res.status(201).json({ success: true, data: day });
  } catch (error) {
    console.error('Error adding day to itinerary:', error);
    return res.status(500).json({ error: 'Failed to add day to itinerary' });
  }
});

// PATCH: Update a day in the itinerary
router.patch(async (req, res) => {
  try {
    const tripId = req.query.id as string;
    const { dayId } = req.query;
    
    if (!dayId) {
      return res.status(400).json({ error: 'Day ID is required' });
    }
    
    // Validation schema
    const daySchema = z.object({
      note: z.string().optional(),
    });
    
    // Validate request body
    const validationResult = daySchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid day data',
        details: validationResult.error.format(),
      });
    }
    
    const { note } = validationResult.data;
    
    // Check if day exists and belongs to the trip
    const existingDay = await prisma.itineraryDay.findFirst({
      where: {
        id: dayId as string,
        tripId,
      },
    });
    
    if (!existingDay) {
      return res.status(404).json({ error: 'Day not found in this trip itinerary' });
    }
    
    // Update day
    const day = await prisma.itineraryDay.update({
      where: {
        id: dayId as string,
      },
      data: {
        note: note !== undefined ? note : existingDay.note,
      },
    });
    
    return res.status(200).json({ success: true, data: day });
  } catch (error) {
    console.error('Error updating day in itinerary:', error);
    return res.status(500).json({ error: 'Failed to update day in itinerary' });
  }
});

// DELETE: Remove a day from the itinerary
router.delete(async (req, res) => {
  try {
    const tripId = req.query.id as string;
    const { dayId } = req.query;
    
    if (!dayId) {
      return res.status(400).json({ error: 'Day ID is required' });
    }
    
    // Check if day exists and belongs to the trip
    const existingDay = await prisma.itineraryDay.findFirst({
      where: {
        id: dayId as string,
        tripId,
      },
    });
    
    if (!existingDay) {
      return res.status(404).json({ error: 'Day not found in this trip itinerary' });
    }
    
    // Delete day (this will cascade delete activities)
    await prisma.itineraryDay.delete({
      where: {
        id: dayId as string,
      },
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error removing day from itinerary:', error);
    return res.status(500).json({ error: 'Failed to remove day from itinerary' });
  }
});

export default router.handler(); 