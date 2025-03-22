import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { generateAlternativeItinerary } from '@/lib/ai-service';
import { TripGenerationPrompt } from '@/types/ai';
import { ItineraryDay } from '@/types/itinerary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the session to check if the user is authenticated
    const session = await getServerSession(req, res, authOptions);

    // For beta testing with friends and family, you might want to temporarily disable this
    // Uncomment this check for production
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      tripId,
      destination,
      startDate,
      endDate,
      budget,
      interests,
      currentItinerary,
      travelers,
    } = req.body;

    // Validate required fields
    if (!destination || !startDate || !endDate || !budget || !interests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call our AI service
    const prompt: TripGenerationPrompt = {
      destination,
      startDate,
      endDate,
      budget,
      interests,
      travelers: travelers || 1,
    };

    const itinerary = await generateAlternativeItinerary(prompt, currentItinerary);

    return res.status(200).json({ itinerary });
  } catch (error) {
    console.error('Error generating alternative itinerary:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
