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

// Middleware to check if user can manage collaborators
router.use(async (req, res, next) => {
  if (req.method === 'POST' || req.method === 'DELETE') {
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
                role: 'OWNER',
              },
            },
          },
        ],
      },
    });
    
    if (!trip) {
      return res.status(403).json({ error: 'You do not have permission to manage collaborators for this trip' });
    }
  }
  
  return next();
});

// GET: List collaborators for a trip
router.get(async (req, res) => {
  try {
    const tripId = req.query.id as string;
    const userId = req.user!.id;
    
    // Check if user has access to the trip
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
      return res.status(403).json({ error: 'You do not have access to this trip' });
    }
    
    // Fetch collaborators
    const collaborators = await prisma.collaboration.findMany({
      where: { tripId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    // Add owner as a virtual collaborator
    const owner = await prisma.user.findUnique({
      where: { id: trip.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    
    const result = [
      {
        userId: owner?.id,
        role: 'OWNER' as const,
        user: owner,
        isOwner: true,
      },
      ...collaborators.map(collab => ({
        ...collab,
        isOwner: false,
      })),
    ];
    
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    return res.status(500).json({ error: 'Failed to fetch collaborators' });
  }
});

// POST: Add collaborator to trip
router.post(async (req, res) => {
  try {
    const tripId = req.query.id as string;
    
    // Validation schema
    const collaboratorSchema = z.object({
      email: z.string().email('Invalid email format'),
      role: z.enum(['EDITOR', 'VIEWER']),
    });
    
    // Validate request body
    const validationResult = collaboratorSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid collaborator data',
        details: validationResult.error.format(),
      });
    }
    
    const { email, role } = validationResult.data;
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user is already a collaborator
    const existingCollaboration = await prisma.collaboration.findFirst({
      where: {
        tripId,
        userId: user.id,
      },
    });
    
    if (existingCollaboration) {
      return res.status(400).json({ error: 'User is already a collaborator' });
    }
    
    // Add collaborator
    const collaboration = await prisma.collaboration.create({
      data: {
        tripId,
        userId: user.id,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    return res.status(201).json({ success: true, data: collaboration });
  } catch (error) {
    console.error('Error adding collaborator:', error);
    return res.status(500).json({ error: 'Failed to add collaborator' });
  }
});

// DELETE: Remove collaborator from trip
router.delete(async (req, res) => {
  try {
    const tripId = req.query.id as string;
    const { collaboratorId } = req.query;
    
    if (!collaboratorId) {
      return res.status(400).json({ error: 'Collaborator ID is required' });
    }
    
    // Remove collaborator
    await prisma.collaboration.deleteMany({
      where: {
        tripId,
        userId: collaboratorId as string,
      },
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error removing collaborator:', error);
    return res.status(500).json({ error: 'Failed to remove collaborator' });
  }
});

export default router.handler(); 