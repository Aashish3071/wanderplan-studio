import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { suggestReplacement } from '@/lib/ai-service';
import { ActivitySuggestionPrompt } from '@/types/ai';

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

    const { tripId, dayId, date, destination, interests, budget, excludedPlaceIds } = req.body;

    // Validate required fields
    if (!destination || !date || !interests || !budget) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call our AI service
    const prompt: ActivitySuggestionPrompt = {
      destination,
      date,
      interests,
      budget,
      excludedPlaceIds: excludedPlaceIds || [],
    };

    const activity = await suggestReplacement(prompt);

    return res.status(200).json({ activity });
  } catch (error) {
    console.error('Error suggesting replacement activity:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
