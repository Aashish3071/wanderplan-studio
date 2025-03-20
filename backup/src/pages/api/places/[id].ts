import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { createRouter } from 'next-connect';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { PlaceType, PriceRange } from '@prisma/client';

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

// GET: Retrieve a place by ID
router.get(async (req, res) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Place ID is required' });
    }

    // Get the place with its location and reviews
    const place = await prisma.place.findUnique({
      where: { id },
      include: {
        location: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!place) {
      return res.status(404).json({ success: false, error: 'Place not found' });
    }

    return res.status(200).json({
      success: true,
      data: place,
    });
  } catch (error) {
    console.error('Error fetching place:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch place' });
  }
});

// PUT: Update a place
router.put(async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Place ID is required' });
    }

    // Check if place exists and user has permission to edit
    const place = await prisma.place.findUnique({
      where: { id },
      select: {
        createdBy: true,
        locationId: true,
      },
    });

    if (!place) {
      return res.status(404).json({ success: false, error: 'Place not found' });
    }

    // Check if user has permission to edit this place
    if (place.createdBy !== userId) {
      return res
        .status(403)
        .json({ success: false, error: 'You do not have permission to edit this place' });
    }

    // Validation schema for place update
    const updateSchema = z.object({
      name: z.string().min(1, 'Name is required').optional(),
      description: z.string().optional(),
      type: z.nativeEnum(PlaceType).optional(),
      address: z.string().optional(),
      website: z.string().url('Invalid website URL').optional().nullable(),
      phone: z.string().optional().nullable(),
      openingHours: z.string().optional().nullable(),
      priceRange: z.nativeEnum(PriceRange).optional().nullable(),
      imageUrl: z.string().url('Invalid image URL').optional().nullable(),
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

    // Prepare update data
    const updateData: any = {};

    // Add fields to update data if they are provided
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.openingHours !== undefined) updateData.openingHours = data.openingHours;
    if (data.priceRange !== undefined) updateData.priceRange = data.priceRange;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    // Update or create location if provided
    if (data.location) {
      if (place.locationId) {
        // Update existing location
        await prisma.location.update({
          where: { id: place.locationId },
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

    // Update the place
    const updatedPlace = await prisma.place.update({
      where: { id },
      data: updateData,
      include: {
        location: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedPlace,
    });
  } catch (error) {
    console.error('Error updating place:', error);
    return res.status(500).json({ success: false, error: 'Failed to update place' });
  }
});

// DELETE: Delete a place
router.delete(async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Place ID is required' });
    }

    // Check if place exists and user has permission to delete
    const place = await prisma.place.findUnique({
      where: { id },
      select: {
        createdBy: true,
        locationId: true,
      },
    });

    if (!place) {
      return res.status(404).json({ success: false, error: 'Place not found' });
    }

    // Check if user has permission to delete this place
    if (place.createdBy !== userId) {
      return res
        .status(403)
        .json({ success: false, error: 'You do not have permission to delete this place' });
    }

    // Begin transaction to delete the place and its related data
    await prisma.$transaction(async (tx) => {
      // Check if place is referenced by any activities
      const activities = await tx.activity.findMany({
        where: { placeId: id },
        select: { id: true },
      });

      if (activities.length > 0) {
        // Disconnect place from activities instead of deleting the place
        await tx.activity.updateMany({
          where: { placeId: id },
          data: { placeId: null },
        });
      } else {
        // Delete the place
        await tx.place.delete({
          where: { id },
        });

        // Delete the associated location if it exists
        if (place.locationId) {
          await tx.location.delete({
            where: { id: place.locationId },
          });
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Place deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting place:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete place' });
  }
});

export default router.handler();
