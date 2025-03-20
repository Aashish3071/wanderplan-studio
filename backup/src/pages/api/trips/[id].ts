import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
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
  
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  req.user = session.user;
  return next();
});

// Middleware to check trip access
router.use(async (req, res, next) => {
  if (req.method === 'GET' && req.query.id) {
    const tripId = req.query.id as string;
    const userId = req.user!.id;
    
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        collaborators: {
          where: { userId },
          select: { role: true },
        },
      },
    });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    // Check if user is owner or collaborator
    if (trip.userId !== userId && trip.collaborators.length === 0 && !trip.isPublic) {
      return res.status(403).json({ error: 'Access denied' });
    }
  }
  
  return next();
});

// GET: Get trip by ID
router.get(async (req, res) => {
  try {
    const tripId = req.query.id as string;
    
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
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
                id: true,
                name: true,
                image: true,
                email: true,
              },
            },
          },
        },
        itinerary: {
          include: {
            days: {
              include: {
                activities: true,
                meals: true,
                accommodation: true,
                transportation: true,
              },
              orderBy: {
                date: 'asc',
              },
            },
            budgetBreakdown: true,
          },
        },
      },
    });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    return res.status(200).json({ success: true, data: trip });
  } catch (error) {
    console.error('Error fetching trip:', error);
    return res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// PATCH: Update trip
router.patch(async (req, res) => {
  try {
    const tripId = req.query.id as string;
    const userId = req.user!.id;
    
    // Check ownership or edit permissions
    const tripAccess = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { userId },
          {
            collaborators: {
              some: {
                userId,
                role: { in: ['OWNER', 'EDITOR'] },
              },
            },
          },
        ],
      },
    });
    
    if (!tripAccess) {
      return res.status(403).json({ error: 'You do not have permission to update this trip' });
    }
    
    // Validation schema
    const updateTripSchema = z.object({
      title: z.string().min(3, 'Title must be at least 3 characters').optional(),
      description: z.string().optional().nullable(),
      destination: z.string().min(2, 'Destination must be at least 2 characters').optional(),
      startDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
        message: 'Invalid start date format',
      }).optional(),
      endDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
        message: 'Invalid end date format',
      }).optional(),
      budget: z.number().optional().nullable(),
      status: z.enum(['PLANNING', 'BOOKED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
      isPublic: z.boolean().optional(),
    });
    
    // Validate request body
    const validationResult = updateTripSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid trip data',
        details: validationResult.error.format(),
      });
    }
    
    const data = validationResult.data;
    
    // Prepare update data
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.destination !== undefined) updateData.destination = data.destination;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
    if (data.budget !== undefined) updateData.budget = data.budget;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
    
    // Update trip
    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
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
    
    return res.status(200).json({ success: true, data: trip });
  } catch (error) {
    console.error('Error updating trip:', error);
    return res.status(500).json({ error: 'Failed to update trip' });
  }
});

// DELETE: Delete trip
router.delete(async (req, res) => {
  try {
    const tripId = req.query.id as string;
    const userId = req.user!.id;
    
    // Check ownership
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { userId },
          {
            collaborators: {
              some: {
                userId,
                role: 'OWNER',
              },
            },
          },
        ],
      },
    });
    
    if (!trip) {
      return res.status(403).json({ error: 'You do not have permission to delete this trip' });
    }
    
    // Delete trip
    await prisma.trip.delete({
      where: { id: tripId },
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return res.status(500).json({ error: 'Failed to delete trip' });
  }
});

export default router.handler(); 