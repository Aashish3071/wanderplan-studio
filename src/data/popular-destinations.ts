// Popular destinations data for suggestions
export const popularDestinations = [
  {
    id: 1,
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    popularity: 'high',
    bestSeasons: ['spring', 'fall'],
  },
  {
    id: 2,
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    popularity: 'high',
    bestSeasons: ['spring', 'fall'],
  },
  {
    id: 3,
    name: 'New York City',
    country: 'United States',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    popularity: 'high',
    bestSeasons: ['spring', 'fall'],
  },
  {
    id: 4,
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
    popularity: 'high',
    bestSeasons: ['spring', 'fall'],
  },
  {
    id: 5,
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    popularity: 'high',
    bestSeasons: ['summer', 'spring'],
  },
  {
    id: 6,
    name: 'Barcelona',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
    popularity: 'high',
    bestSeasons: ['spring', 'fall'],
  },
  {
    id: 7,
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1507501336603-6e31db2be093',
    popularity: 'high',
    bestSeasons: ['summer', 'spring'],
  },
  {
    id: 8,
    name: 'London',
    country: 'United Kingdom',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
    popularity: 'high',
    bestSeasons: ['summer', 'spring'],
  },
  {
    id: 9,
    name: 'Sydney',
    country: 'Australia',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9',
    popularity: 'high',
    bestSeasons: ['summer', 'spring'],
  },
  {
    id: 10,
    name: 'Dubai',
    country: 'United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
    popularity: 'high',
    bestSeasons: ['winter', 'fall'],
  },
  {
    id: 11,
    name: 'Kyoto',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    popularity: 'medium',
    bestSeasons: ['spring', 'fall'],
  },
  {
    id: 12,
    name: 'Machu Picchu',
    country: 'Peru',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377',
    popularity: 'medium',
    bestSeasons: ['winter', 'fall'],
  },
  {
    id: 13,
    name: 'Rio de Janeiro',
    country: 'Brazil',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325',
    popularity: 'medium',
    bestSeasons: ['summer', 'spring'],
  },
  {
    id: 14,
    name: 'Amsterdam',
    country: 'Netherlands',
    image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4',
    popularity: 'medium',
    bestSeasons: ['spring', 'summer'],
  },
  {
    id: 15,
    name: 'Marrakech',
    country: 'Morocco',
    image: 'https://images.unsplash.com/photo-1560095633-8c47d0b96e43',
    popularity: 'medium',
    bestSeasons: ['spring', 'fall'],
  },
  {
    id: 16,
    name: 'Bangkok',
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5',
    popularity: 'medium',
    bestSeasons: ['winter', 'fall'],
  },
  {
    id: 17,
    name: 'Prague',
    country: 'Czech Republic',
    image: 'https://images.unsplash.com/photo-1541849546-216549ae216d',
    popularity: 'medium',
    bestSeasons: ['spring', 'fall'],
  },
  {
    id: 18,
    name: 'Reykjavik',
    country: 'Iceland',
    image: 'https://images.unsplash.com/photo-1504284769761-8bbaa6ad9267',
    popularity: 'medium',
    bestSeasons: ['summer', 'spring'],
  },
];

// AI-generated trip name suggestions based on destination
export const generateTripNameSuggestions = (destination: string, season?: string): string[] => {
  if (!destination) return [];

  const baseNames = [
    `${season ? capitalizeFirstLetter(season) : 'Dream'} Trip to ${destination}`,
    `${destination} Adventure`,
    `Exploring ${destination}`,
    `${destination} Getaway`,
    `Discover ${destination}`,
  ];

  const seasonalNames = season
    ? [
        `${capitalizeFirstLetter(season)} in ${destination}`,
        `${destination} ${capitalizeFirstLetter(season)} Escape`,
      ]
    : [];

  // Special suggestions based on destination
  const specialSuggestions: Record<string, string[]> = {
    Paris: ['Romantic Paris Getaway', 'City of Lights Exploration', 'Parisian Dreams'],
    Tokyo: ['Tokyo Tech & Traditions', 'Futuristic Tokyo Adventure', 'Tokyo: Past & Present'],
    'New York City': [
      'Big Apple Adventure',
      'NYC: The City That Never Sleeps',
      'Manhattan & Beyond',
    ],
    Rome: ['Ancient Rome Exploration', 'Roman Holiday', 'Italian Capital Adventure'],
    Bali: ['Bali Paradise Retreat', 'Island Bliss: Bali', 'Spiritual Bali Journey'],
    Barcelona: ['Barcelona: Gaudí & Beaches', 'Catalonian Adventure', 'Barcelona City Break'],
    London: ['Royal London Tour', 'London Calling', 'British Capital Exploration'],
  };

  const special = specialSuggestions[destination] || [];

  return [...baseNames, ...seasonalNames, ...special];
};

// Get current season based on month
export const getCurrentSeason = (): 'winter' | 'spring' | 'summer' | 'fall' => {
  const month = new Date().getMonth(); // 0-11

  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

// Recommend good travel dates based on destination and preferences
export const recommendTravelDates = (
  destination: string,
  preferredSeason?: string
): { startDate: string; endDate: string } => {
  // Default trip length is 7 days
  const tripLengthDays = 7;

  // Find destination in our data
  const destinationData = popularDestinations.find(
    (d) => d.name.toLowerCase() === destination.toLowerCase()
  );

  // Determine best season
  let season = preferredSeason || getCurrentSeason();
  if (destinationData && !preferredSeason) {
    // If no preference, use the first best season
    season = destinationData.bestSeasons[0] || getCurrentSeason();
  }

  // Find a good starting month for the selected season
  const seasonMonths: Record<string, number[]> = {
    winter: [0, 1, 11], // Jan, Feb, Dec
    spring: [2, 3, 4], // Mar, Apr, May
    summer: [5, 6, 7], // Jun, Jul, Aug
    fall: [8, 9, 10], // Sep, Oct, Nov
  };

  // Pick a month from the middle of the season
  const monthsForSeason = seasonMonths[season] || [new Date().getMonth()];
  const selectedMonth = monthsForSeason[Math.floor(monthsForSeason.length / 2)];

  // Create dates 30-60 days in the future if in current year, or in selected month if next year
  const today = new Date();
  const currentYear = today.getFullYear();
  const futureYear = selectedMonth < today.getMonth() ? currentYear + 1 : currentYear;

  // Create a date in the middle of the month
  const startDate = new Date(futureYear, selectedMonth, 15);

  // Add some days to avoid starting on the exact same date always
  startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 10));

  // End date is start date + trip length
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + tripLengthDays);

  // Format dates as ISO strings (YYYY-MM-DD)
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

// Helper function to capitalize the first letter
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
