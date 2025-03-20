import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { createRouter } from 'next-connect';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { ActivityType, TransportType } from '@prisma/client';

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

// Helper function to check if user has access to an activity
async function hasAccessToActivity(activityId: string, userId: string, requireWriteAccess = false) {
  const activity = await prisma.activity.findFirst({
    where: { id: activityId },
    include: {
      itineraryDay: {
        include: {
          trip: true,
        },
      },
    },
  });

  if (!activity) {
    return false;
  }

  const tripId = activity.itineraryDay.tripId;

  // Check if user is the trip owner
  if (activity.itineraryDay.trip.userId === userId) {
    return true;
  }

  // Check if user is a collaborator with appropriate access
  const collaboration = await prisma.collaboration.findFirst({
    where: {
      tripId,
      userId,
      ...(requireWriteAccess ? { role: { in: ['OWNER', 'EDITOR'] } } : {}),
    },
  });

  return !!collaboration;
}

// GET: Retrieve an activity by ID
router.get(async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Activity ID is required' });
    }

    // Check if user has access to the activity
    const canAccess = await hasAccessToActivity(id, userId);

    if (!canAccess) {
      return res
        .status(404)
        .json({ success: false, error: 'Activity not found or you do not have access' });
    }

    // Get the activity details
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        place: true,
        location: true,
        itineraryDay: {
          select: {
            date: true,
            tripId: true,
            trip: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }

    return res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch activity' });
  }
});

// PUT: Update an activity
router.put(async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Activity ID is required' });
    }

    // Check if user has write access to the activity
    const canEdit = await hasAccessToActivity(id, userId, true);

    if (!canEdit) {
      return res
        .status(403)
        .json({ success: false, error: 'You do not have permission to edit this activity' });
    }

    // Validation schema for activity update
    const updateSchema = z.object({
      title: z.string().min(1, 'Title is required').optional(),
      startTime: z
        .string()
        .refine((value) => !isNaN(Date.parse(value)), {
          message: 'Invalid start time format',
        })
        .optional(),
      endTime: z
        .string()
        .refine((value) => !isNaN(Date.parse(value)), {
          message: 'Invalid end time format',
        })
        .optional(),
      description: z.string().optional(),
      type: z.nativeEnum(ActivityType).optional(),
      cost: z.number().optional(),
      transportType: z.nativeEnum(TransportType).optional().nullable(),
      placeId: z.string().optional().nullable(),
      location: z
        .object({
          latitude: z.number(),
          longitude: z.number(),
          address: z.string().optional(),
          name: z.string().optional(),
        })
        .optional(),
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

    // Get the current activity for validation
    const currentActivity = await prisma.activity.findUnique({
      where: { id },
      include: {
        location: true,
      },
    });

    if (!currentActivity) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }

    // Validate time range if both start and end times are provided
    if (data.startTime && data.endTime) {
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);

      if (startTime >= endTime) {
        return res.status(400).json({ success: false, error: 'End time must be after start time' });
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.startTime !== undefined) updateData.startTime = new Date(data.startTime);
    if (data.endTime !== undefined) updateData.endTime = new Date(data.endTime);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.cost !== undefined) updateData.cost = data.cost;
    if (data.transportType !== undefined) updateData.transportType = data.transportType;
    if (data.placeId !== undefined) updateData.placeId = data.placeId;

    // Update location if provided
    if (data.location) {
      if (currentActivity.locationId) {
        // Update existing location
        await prisma.location.update({
          where: { id: currentActivity.locationId },
          data: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            address: data.location.address,
            name: data.location.name,
          },
        });
      } else {
        // Create new location
        const location = await prisma.location.create({
          data: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            address: data.location.address,
            name: data.location.name,
          },
        });

        updateData.locationId = location.id;
      }
    }

    // Update the activity
    const updatedActivity = await prisma.activity.update({
      where: { id },
      data: updateData,
      include: {
        place: true,
        location: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedActivity,
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    return res.status(500).json({ success: false, error: 'Failed to update activity' });
  }
});

// DELETE: Delete an activity
router.delete(async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Activity ID is required' });
    }

    // Check if user has write access to the activity
    const canDelete = await hasAccessToActivity(id, userId, true);

    if (!canDelete) {
      return res
        .status(403)
        .json({ success: false, error: 'You do not have permission to delete this activity' });
    }

    // Get the current activity to check if it has a location
    const activity = await prisma.activity.findUnique({
      where: { id },
      select: { locationId: true },
    });

    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }

    // Begin transaction to delete the activity and its location if it has one
    await prisma.$transaction(async (tx) => {
      // Delete the activity
      await tx.activity.delete({
        where: { id },
      });

      // Delete the associated location if it exists
      if (activity.locationId) {
        await tx.location.delete({
          where: { id: activity.locationId },
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Activity deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete activity' });
  }
});

export default router.handler();
