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

// Helper function to check if user has access to the itinerary day
async function hasAccess(dayId: string, userId: string, requireWriteAccess = false) {
  const day = await prisma.itineraryDay.findFirst({
    where: { id: dayId },
    include: {
      trip: true,
    },
  });

  if (!day) {
    return false;
  }

  // Check if user is the trip owner
  if (day.trip.userId === userId) {
    return true;
  }

  // Check if user is a collaborator with appropriate access
  const collaboration = await prisma.collaboration.findFirst({
    where: {
      tripId: day.tripId,
      userId,
      ...(requireWriteAccess ? { role: { in: ['OWNER', 'EDITOR'] } } : {}),
    },
  });

  return !!collaboration;
}

// GET: Retrieve an itinerary day by ID
router.get(async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Itinerary day ID is required' });
    }

    // Check if user has access to the itinerary day
    const canAccess = await hasAccess(id, userId);

    if (!canAccess) {
      return res
        .status(404)
        .json({ success: false, error: 'Itinerary day not found or you do not have access' });
    }

    // Get the itinerary day with activities
    const itineraryDay = await prisma.itineraryDay.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: {
            startTime: 'asc',
          },
          include: {
            place: true,
            location: true,
          },
        },
        trip: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!itineraryDay) {
      return res.status(404).json({ success: false, error: 'Itinerary day not found' });
    }

    return res.status(200).json({
      success: true,
      data: itineraryDay,
    });
  } catch (error) {
    console.error('Error fetching itinerary day:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch itinerary day' });
  }
});

// PUT: Update an itinerary day
router.put(async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Itinerary day ID is required' });
    }

    // Check if user has write access to the itinerary day
    const canEdit = await hasAccess(id, userId, true);

    if (!canEdit) {
      return res
        .status(403)
        .json({ success: false, error: 'You do not have permission to edit this itinerary day' });
    }

    // Validation schema
    const updateSchema = z.object({
      date: z
        .string()
        .refine((value) => !isNaN(Date.parse(value)), {
          message: 'Invalid date format',
        })
        .optional(),
      notes: z.string().optional(),
    });

    // Validate request body
    const validationResult = updateSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid update data',
        details: validationResult.error.format(),
      });
    }

    const data = validationResult.data;

    // Prepare update data
    const updateData: any = {};

    if (data.date !== undefined) {
      updateData.date = new Date(data.date);
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    // Update the itinerary day
    const updatedDay = await prisma.itineraryDay.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      data: updatedDay,
    });
  } catch (error) {
    console.error('Error updating itinerary day:', error);
    return res.status(500).json({ success: false, error: 'Failed to update itinerary day' });
  }
});

// DELETE: Delete an itinerary day
router.delete(async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Itinerary day ID is required' });
    }

    // Check if user has write access to the itinerary day
    const canEdit = await hasAccess(id, userId, true);

    if (!canEdit) {
      return res
        .status(403)
        .json({ success: false, error: 'You do not have permission to delete this itinerary day' });
    }

    // Delete the itinerary day and all associated activities
    await prisma.itineraryDay.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Itinerary day deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting itinerary day:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete itinerary day' });
  }
});

export default router.handler();
