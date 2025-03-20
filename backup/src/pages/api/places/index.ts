import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { createRouter } from 'next-connect';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { PlaceType, PriceRange } from '@prisma/client';

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

// GET: List places with optional filtering
router.get(async (req, res) => {
  try {
    const { search, type, limit = '10', offset = '0', lat, lng, radius } = req.query;

    // Build query filter conditions
    const where: any = {};

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type && typeof type === 'string') {
      where.type = type;
    }

    // If location parameters are provided, filter by distance
    if (
      lat &&
      lng &&
      radius &&
      typeof lat === 'string' &&
      typeof lng === 'string' &&
      typeof radius === 'string'
    ) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusKm = parseFloat(radius);

      if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(radiusKm)) {
        // For PostgreSQL we can use the earthdistance extension
        // This is an approximation for demonstration purposes
        // In production, use a proper geospatial query

        // Filter places that have location data
        where.location = {
          isNot: null,
        };

        // We'll get all places with locations and filter them in-memory
        // In a real app, you would use a SQL query with distance calculation
      }
    }

    // Get places with pagination
    const [places, count] = await Promise.all([
      prisma.place.findMany({
        where,
        include: {
          location: true,
          reviews: {
            take: 3,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip: parseInt(offset as string),
        take: parseInt(limit as string),
      }),
      prisma.place.count({ where }),
    ]);

    // If location filtering is requested, perform in-memory filtering
    let filteredPlaces = places;

    if (
      lat &&
      lng &&
      radius &&
      typeof lat === 'string' &&
      typeof lng === 'string' &&
      typeof radius === 'string'
    ) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusKm = parseFloat(radius);

      if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(radiusKm)) {
        filteredPlaces = places.filter((place) => {
          if (!place.location) return false;

          // Calculate distance using the Haversine formula
          const distance = calculateDistance(
            latitude,
            longitude,
            place.location.latitude,
            place.location.longitude
          );

          return distance <= radiusKm;
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: filteredPlaces,
      meta: {
        total: count,
        filtered: filteredPlaces.length,
        offset: parseInt(offset as string),
        limit: parseInt(limit as string),
      },
    });
  } catch (error) {
    console.error('Error fetching places:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch places' });
  }
});

// POST: Create a new place
router.post(async (req, res) => {
  try {
    const userId = req.user.id;

    // Validation schema
    const placeSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      description: z.string().optional(),
      type: z.nativeEnum(PlaceType),
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
    const validationResult = placeSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid place data',
        details: validationResult.error.format(),
      });
    }

    const data = validationResult.data;

    // Create location if provided
    let locationId = undefined;

    if (data.location) {
      const location = await prisma.location.create({
        data: {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          address: data.location.address,
          name: data.location.name,
        },
      });

      locationId = location.id;
    }

    // Create the place
    const place = await prisma.place.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        address: data.address,
        website: data.website,
        phone: data.phone,
        openingHours: data.openingHours,
        priceRange: data.priceRange,
        imageUrl: data.imageUrl,
        locationId,
        createdBy: userId,
      },
      include: {
        location: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: place,
    });
  } catch (error) {
    console.error('Error creating place:', error);
    return res.status(500).json({ success: false, error: 'Failed to create place' });
  }
});

// Helper function to calculate distance between two coordinates using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default router.handler();
