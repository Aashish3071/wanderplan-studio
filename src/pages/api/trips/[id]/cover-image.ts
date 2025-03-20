import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { createRouter } from 'next-connect';
import { prisma } from '@/lib/prisma';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'trips');

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueFileName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
  },
});

// Extend the NextApiRequest type
interface ExtendedRequest extends NextApiRequest {
  file?: Express.Multer.File;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// Create a new connection router
const router = createRouter<ExtendedRequest, NextApiResponse>();

// Configure multer middleware
const multerMiddleware = upload.single('coverImage');

// Parse form data
router.use(async (req, res, next) => {
  try {
    await new Promise<void>((resolve, reject) => {
      multerMiddleware(req as any, res as any, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
    return next();
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

// Authentication middleware
router.use(async (req, res, next) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  req.user = session.user;
  return next();
});

// POST: Upload trip cover image
router.post(async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid trip ID' });
    }

    // Check if trip exists and belongs to user
    const trip = await prisma.trip.findFirst({
      where: {
        id,
        OR: [
          { userId },
          {
            collaborators: {
              some: {
                userId,
                role: {
                  in: ['OWNER', 'EDITOR'],
                },
              },
            },
          },
        ],
      },
    });

    if (!trip) {
      return res
        .status(404)
        .json({ success: false, error: 'Trip not found or you do not have permission' });
    }

    // Get the uploaded file
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    // Create the relative path to the uploaded file
    const relativePath = `/uploads/trips/${file.filename}`;

    // Update the trip with the new cover image
    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: { coverImage: relativePath },
      select: {
        id: true,
        coverImage: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        id: updatedTrip.id,
        coverImage: updatedTrip.coverImage,
      },
    });
  } catch (error) {
    console.error('Error uploading cover image:', error);
    return res.status(500).json({ success: false, error: 'Failed to upload cover image' });
  }
});

// Export the handler
export default router.handler();

// Disable body parsing, as multer will handle it
export const config = {
  api: {
    bodyParser: false,
  },
};
