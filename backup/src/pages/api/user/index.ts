import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { createRouter } from 'next-connect';
import { prisma } from '@/lib/prisma';

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

// GET: Get current user profile
router.get(async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        trips: {
          select: {
            id: true,
            title: true,
            destination: true,
            startDate: true,
            endDate: true,
            status: true,
          },
          orderBy: {
            startDate: 'desc',
          },
          take: 5,
        },
        collaborations: {
          select: {
            role: true,
            trip: {
              select: {
                id: true,
                title: true,
                destination: true,
                startDate: true,
                endDate: true,
                status: true,
                user: {
                  select: {
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PATCH: Update user profile
router.patch(async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    
    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'Failed to update user profile' });
  }
});

export default router.handler(); 