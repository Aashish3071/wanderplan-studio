import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { differenceInDays, addDays, format } from 'date-fns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Extract trip details from request body
    const {
      destination,
      startDate,
      endDate,
      interests = [],
      budget = null,
      travelers = 1,
    } = req.body;

    // Validate required fields
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = differenceInDays(end, start) + 1;

    if (diffDays < 1) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Generate a sample itinerary (In production, this would call an AI service)
    const itinerary = await generateAIItinerary(
      destination,
      startDate,
      endDate,
      budget,
      interests,
      travelers
    );

    // Return the generated itinerary
    return res.status(200).json({
      success: true,
      itinerary,
    });
  } catch (error) {
    console.error('Error generating AI itinerary:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary' });
  }
}

interface AIItineraryParams {
  destination: string;
  startDate: string;
  endDate: string;
  diffDays: number;
  interests: string[];
  budget: number | null;
  travelers: number;
}

// Mock implementation to generate an AI itinerary
const generateAIItinerary = async (
  destination: string,
  startDate: string,
  endDate: string,
  budget: number | null,
  interests: string[],
  travelers: number
) => {
  // Calculate trip duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const tripDuration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Daily budget calculation
  const dailyBudget = budget ? Math.floor(budget / tripDuration) : 200;

  // Generate a summary based on inputs
  const interestsText = interests.length
    ? `focusing on ${interests.join(', ')}`
    : 'exploring various attractions';

  // Create a simulated delay to mimic AI processing time
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Helper function to get a placeholder image for a location
  const getLocationImage = (location: string, day: number) => {
    // For real implementation, you would connect to an image API like Unsplash or Google Places
    const destinations = {
      Paris: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1545056453-f0c0579ecfcd?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1520939817895-060bdaf4bc05?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1551887373-11fe9d0b29df?auto=format&fit=crop&w=600&q=80',
      ],
      London: [
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=600&q=80',
      ],
      'New York': [
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=600&q=80',
      ],
      Tokyo: [
        'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1532236204992-f5e85c024202?auto=format&fit=crop&w=600&q=80',
      ],
      Rome: [
        'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
      ],
      Barcelona: [
        'https://images.unsplash.com/photo-1579282240050-352db0a14c21?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80',
      ],
    };

    // Check if we have preset images for this destination
    let destinationImages = destinations[destination as keyof typeof destinations];

    // Default fallback images if destination not found
    if (!destinationImages) {
      destinationImages = [
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=600&q=80',
      ];
    }

    // Use a different image for each day by cycling through them
    const imageIndex = (day - 1) % destinationImages.length;
    return destinationImages[imageIndex];
  };

  // Generate sample itinerary
  const days = Array.from({ length: tripDuration }, (_, i) => {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + i);

    // Format date as "Weekday, Month DD, YYYY"
    const formattedDate = dayDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    // Get a title for the day based on the day number
    let title = '';
    if (i === 0) title = `Arrival and Exploring ${destination}`;
    else if (i === tripDuration - 1) title = `Final Day in ${destination}`;
    else {
      const titles = [
        `Discovering ${destination}'s Highlights`,
        `Cultural Day in ${destination}`,
        `Relaxing Day in ${destination}`,
        `Adventure Day in ${destination}`,
        `Historical Tour of ${destination}`,
        `Local Experience in ${destination}`,
      ];
      title = titles[i % titles.length];
    }

    // Generate 3-5 activities for each day
    const numActivities = Math.floor(Math.random() * 3) + 3; // 3-5 activities
    const dayActivities = [];

    const morningActivity = {
      title: `Breakfast at a Local Café`,
      description: `Start your day with a delicious breakfast at a popular local café, trying some ${destination} specialties.`,
      time: '8:00 AM - 9:30 AM',
      cost: Math.floor(Math.random() * 15) + 10,
      location: `Local Café in ${destination}`,
      imageUrl: getLocationImage(destination, i + 1),
      coordinates: { lat: 0, lng: 0 }, // Placeholder for real coordinates
    };
    dayActivities.push(morningActivity);

    // Main activities for the day
    for (let j = 0; j < numActivities - 2; j++) {
      const activityTypes = [
        {
          title: `Visit the ${destination} Museum`,
          description: `Explore the rich history and culture of ${destination} at this renowned museum.`,
          time: j === 0 ? '10:00 AM - 12:30 PM' : '1:30 PM - 3:30 PM',
          cost: Math.floor(Math.random() * 20) + 15,
          location: `${destination} Museum`,
          type: 'cultural',
        },
        {
          title: `Explore ${destination} Park`,
          description: `Take a leisurely stroll through the beautiful ${destination} Park and enjoy the natural scenery.`,
          time: j === 0 ? '10:00 AM - 12:00 PM' : '2:00 PM - 4:00 PM',
          cost: 0,
          location: `${destination} Park`,
          type: 'nature',
        },
        {
          title: `Shopping at ${destination} Market`,
          description: `Find unique souvenirs and local crafts at the famous ${destination} Market.`,
          time: j === 0 ? '10:30 AM - 12:30 PM' : '2:30 PM - 4:30 PM',
          cost: Math.floor(Math.random() * 50) + 20,
          location: `${destination} Market`,
          type: 'shopping',
        },
        {
          title: `${destination} Historical Tour`,
          description: `Join a guided tour to learn about the fascinating history of ${destination}.`,
          time: j === 0 ? '9:30 AM - 12:00 PM' : '1:00 PM - 3:30 PM',
          cost: Math.floor(Math.random() * 25) + 20,
          location: `Downtown ${destination}`,
          type: 'history',
        },
      ];

      // Bias activity selection based on interests if provided
      let activityPool = [...activityTypes];
      if (interests.length > 0) {
        const interestMap: Record<string, string[]> = {
          'Art & Museums': ['cultural'],
          'Food & Dining': ['food'],
          'Nature & Outdoors': ['nature'],
          Shopping: ['shopping'],
          'Culture & History': ['cultural', 'history'],
          Adventure: ['adventure'],
          Relaxation: ['nature', 'relaxation'],
          Nightlife: ['nightlife'],
          Family: ['family', 'nature'],
          Romance: ['romance', 'relaxation'],
        };

        // Create a weighted pool that favors activities matching interests
        const userInterestTypes = interests.flatMap((interest) => interestMap[interest] || []);

        // Add matching activities with higher weight
        activityPool = [
          ...activityTypes,
          ...activityTypes.filter((a) => userInterestTypes.includes(a.type)),
        ];
      }

      // Pick a random activity from the pool
      const activity = activityPool[Math.floor(Math.random() * activityPool.length)];

      dayActivities.push({
        ...activity,
        imageUrl: getLocationImage(destination, i + 1 + j),
        coordinates: { lat: 0, lng: 0 }, // Placeholder for real coordinates
      });
    }

    const eveningActivity = {
      title: `Dinner at a ${destination} Restaurant`,
      description: `Enjoy a delicious dinner at a ${interests.includes('Food & Dining') ? 'gourmet' : 'local'} restaurant, savoring the flavors of ${destination}.`,
      time: '7:00 PM - 9:00 PM',
      cost: Math.floor(Math.random() * 40) + 30,
      location: `Restaurant in ${destination}`,
      imageUrl: getLocationImage(destination, i + numActivities),
      coordinates: { lat: 0, lng: 0 }, // Placeholder for real coordinates
    };
    dayActivities.push(eveningActivity);

    return {
      day: i + 1,
      date: formattedDate,
      title,
      activities: dayActivities,
      imageUrl: getLocationImage(destination, i + 1),
    };
  });

  // Calculate total budget used in the itinerary
  const totalBudgetUsed = days.reduce(
    (total, day) =>
      total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.cost, 0),
    0
  );

  return {
    destination,
    startDate,
    endDate,
    totalBudget: budget,
    budgetUsed: totalBudgetUsed,
    summary: `A ${tripDuration}-day trip to ${destination} for ${travelers} ${
      travelers === 1 ? 'person' : 'people'
    }, ${interestsText}. This itinerary includes a mix of activities to make the most of your visit, with a daily budget of approximately $${dailyBudget}.`,
    days,
    // Main hero image for the trip
    heroImage: getLocationImage(destination, 0),
    // Include map coordinates for the destination
    mapCenter: { lat: 0, lng: 0 }, // Placeholder for the real coordinates
  };
};
