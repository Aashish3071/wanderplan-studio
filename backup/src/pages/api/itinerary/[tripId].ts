import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { createRouter } from 'next-connect';
import { prisma } from '@/lib/prisma';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Middleware to check authentication
router.use(async (req, res, next) => {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  req.user = session.user;
  return next();
});

// GET: Retrieve itinerary by trip ID
router.get(async (req, res) => {
  try {
    const { tripId } = req.query;
    const userId = req.user.id;

    // First check if the trip belongs to the user
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId as string,
        userId,
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // Find itinerary by trip ID
    const itinerary = await prisma.itinerary.findFirst({
      where: { tripId: tripId as string },
      include: {
        days: {
          include: {
            activities: true,
            meals: true,
            accommodation: true,
            transportation: true,
          }
        }
      }
    });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found for this trip",
      });
    }

    return res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    console.error("Error getting itinerary:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get itinerary",
      error: (error as Error).message,
    });
  }
});

// POST: Create a new itinerary
router.post(async (req, res) => {
  try {
    const { tripId } = req.query;
    const userId = req.user.id;

    // First check if the trip belongs to the user
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId as string,
        userId,
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // Check if an itinerary already exists for this trip
    const existingItinerary = await prisma.itinerary.findFirst({
      where: { tripId: tripId as string },
    });

    if (existingItinerary) {
      return res.status(400).json({
        success: false,
        message: "An itinerary already exists for this trip",
      });
    }

    // Validate and create the itinerary (simplified for example)
    const {
      destination,
      startDate,
      endDate,
      days,
      budgetBreakdown,
      totalCost,
    } = req.body;

    // Create new itinerary with Prisma
    const newItinerary = await prisma.itinerary.create({
      data: {
        tripId: tripId as string,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        version: 1,
        generatedAt: new Date(),
        totalCost,
        budgetBreakdown: {
          create: budgetBreakdown
        },
        days: {
          create: days.map((day: any) => ({
            date: new Date(day.date),
            notes: day.notes,
            activities: {
              create: day.activities
            },
            meals: {
              create: day.meals
            },
            accommodation: day.accommodation 
              ? { create: day.accommodation }
              : undefined,
            transportation: {
              create: day.transportation || []
            }
          }))
        }
      }
    });

    // Update trip with itinerary reference
    await prisma.trip.update({
      where: { id: tripId as string },
      data: { itineraryId: newItinerary.id }
    });

    return res.status(201).json({
      success: true,
      message: "Itinerary created successfully",
      data: newItinerary,
    });
  } catch (error) {
    console.error("Error creating itinerary:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create itinerary",
      error: (error as Error).message,
    });
  }
});

export default router.handler(); 