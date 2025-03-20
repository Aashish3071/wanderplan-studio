import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { NextHandler } from 'next-connect';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

// Add user property to NextApiRequest
declare module 'next' {
  interface NextApiRequest {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    prisma?: PrismaClient;
  }
}

/**
 * Authentication middleware for API routes
 */
export async function requireAuth(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
  // Check for test mode headers from middleware
  const isTestMode = req.headers['x-test-mode'] === 'true';
  const testUserId = req.headers['x-test-user-id'] as string;

  if (isTestMode && testUserId) {
    console.log('Using test user for authentication:', testUserId);
    req.user = {
      id: testUserId,
      name: 'Test User',
      email: 'test@example.com',
      image: null,
    };
    return next();
  }

  // Regular authentication flow
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
}

/**
 * Format API error response
 */
export function formatApiError(error: unknown): { message: string; details?: unknown } {
  console.error('API Error:', error);

  if (error instanceof Error) {
    return {
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    };
  }

  return {
    message: 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? error : undefined,
  };
}

/**
 * Validate pagination parameters
 */
export function getPaginationParams(req: NextApiRequest) {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Create a standard API response
 */
export function createApiResponse<T>(data: T, meta?: Record<string, unknown>) {
  return {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
}

/**
 * Create a standard pagination response
 */
export function createPaginationResponse<T>(
  data: T[],
  { page, limit, total }: { page: number; limit: number; total: number }
) {
  return createApiResponse(data, {
    pagination: {
      page,
      pageSize: limit,
      pageCount: Math.ceil(total / limit),
      total,
    },
  });
}
