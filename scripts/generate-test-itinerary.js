// This script generates a test itinerary using the mock provider
const fs = require('fs');
const path = require('path');

// Mock setup to simulate the AI provider
const mockItinerary = {
  summary:
    'A 5-day adventure in Paris exploring the best local sights, cuisine, and culture. This itinerary is tailored for art, history, food enthusiasts with a moderate budget.',
  mapCenter: { lat: 48.8566, lng: 2.3522 },
  days: [],
};

// Define local image paths instead of remote URLs
const localImagePaths = {
  louvre: '/images/itinerary/louvre.jpg',
  orsay: '/images/itinerary/orsay.jpg',
  montmartre: '/images/itinerary/montmartre.jpg',
  eiffel: '/images/itinerary/eiffel.jpg',
  versailles: '/images/itinerary/versailles.jpg',
  cafe: '/images/itinerary/cafe.jpg',
  seine: '/images/itinerary/seine.jpg',
  bistro: '/images/itinerary/bistro.jpg',
  paris1: '/images/itinerary/paris1.jpg',
  paris2: '/images/itinerary/paris2.jpg',
  paris3: '/images/itinerary/paris3.jpg',
  paris4: '/images/itinerary/paris4.jpg',
  paris5: '/images/itinerary/paris5.jpg',
};

// Create image directory if it doesn't exist
const imageDir = path.join(__dirname, '..', 'public', 'images', 'itinerary');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Generate sample days
for (let i = 0; i < 5; i++) {
  const date = new Date('2023-10-01');
  date.setDate(date.getDate() + i);

  const activities = [
    {
      title: 'Morning at the Louvre',
      description:
        "Explore one of the world's largest art museums, home to thousands of works including the Mona Lisa.",
      location: 'Musée du Louvre',
      coordinates: { lat: 48.8606, lng: 2.3376 },
      time: '09:00 - 12:00',
      cost: 17,
      imageUrl: localImagePaths.louvre,
    },
    {
      title: 'Lunch at Café Marly',
      description: "Enjoy French cuisine with a view of the Louvre's courtyard and pyramid.",
      location: 'Café Marly',
      coordinates: { lat: 48.8631, lng: 2.3353 },
      time: '12:30 - 14:00',
      cost: 35,
      imageUrl: localImagePaths.cafe,
    },
    {
      title: 'Seine River Cruise',
      description:
        "Relax on a boat cruise along the Seine River, viewing Paris's iconic landmarks from the water.",
      location: 'Bateaux Parisiens',
      coordinates: { lat: 48.853, lng: 2.3499 },
      time: '15:00 - 16:30',
      cost: 15,
      imageUrl: localImagePaths.seine,
    },
    {
      title: 'Dinner in Le Marais',
      description:
        'Experience the vibrant neighborhood of Le Marais and enjoy dinner at a traditional bistro.',
      location: 'Le Marais',
      coordinates: { lat: 48.8559, lng: 2.3584 },
      time: '19:00 - 21:00',
      cost: 45,
      imageUrl: localImagePaths.bistro,
    },
  ];

  // Add some variation for each day
  const modifiedActivities = activities.map((activity, actIndex) => {
    // Create a copy to avoid modifying the original
    const newActivity = { ...activity };

    // Slight modifications for each day
    if (i === 1) {
      newActivity.title = actIndex === 0 ? "Morning at Musée d'Orsay" : activity.title;
      newActivity.description =
        actIndex === 0
          ? "Visit the Musée d'Orsay, housed in the former Orsay railway station, and known for its collection of impressionist art."
          : activity.description;
      newActivity.location = actIndex === 0 ? "Musée d'Orsay" : activity.location;
      newActivity.coordinates = actIndex === 0 ? { lat: 48.86, lng: 2.3266 } : activity.coordinates;
      newActivity.imageUrl = actIndex === 0 ? localImagePaths.orsay : activity.imageUrl;
    } else if (i === 2) {
      newActivity.title = actIndex === 0 ? 'Morning at Montmartre' : activity.title;
      newActivity.description =
        actIndex === 0
          ? 'Explore the charming hilltop neighborhood of Montmartre, known for its artistic history and the beautiful Sacré-Cœur Basilica.'
          : activity.description;
      newActivity.location = actIndex === 0 ? 'Montmartre' : activity.location;
      newActivity.coordinates =
        actIndex === 0 ? { lat: 48.8867, lng: 2.3431 } : activity.coordinates;
      newActivity.imageUrl = actIndex === 0 ? localImagePaths.montmartre : activity.imageUrl;
    } else if (i === 3) {
      newActivity.title = actIndex === 0 ? 'Morning at Eiffel Tower' : activity.title;
      newActivity.description =
        actIndex === 0
          ? "Visit the iconic Eiffel Tower, one of the world's most recognized landmarks and enjoy panoramic views of Paris."
          : activity.description;
      newActivity.location = actIndex === 0 ? 'Eiffel Tower' : activity.location;
      newActivity.coordinates =
        actIndex === 0 ? { lat: 48.8584, lng: 2.2945 } : activity.coordinates;
      newActivity.imageUrl = actIndex === 0 ? localImagePaths.eiffel : activity.imageUrl;
    } else if (i === 4) {
      newActivity.title = actIndex === 0 ? 'Morning at Versailles' : activity.title;
      newActivity.description =
        actIndex === 0
          ? 'Take a day trip to the Palace of Versailles, the former royal residence known for its opulent décor, Hall of Mirrors, and expansive gardens.'
          : activity.description;
      newActivity.location = actIndex === 0 ? 'Palace of Versailles' : activity.location;
      newActivity.coordinates =
        actIndex === 0 ? { lat: 48.8049, lng: 2.1204 } : activity.coordinates;
      newActivity.imageUrl = actIndex === 0 ? localImagePaths.versailles : activity.imageUrl;
    }

    // Slightly adjust the cost for variety
    newActivity.cost = Math.round(activity.cost * (0.9 + i * 0.1));

    return newActivity;
  });

  const day = {
    day: i + 1,
    date: date.toISOString().split('T')[0],
    title:
      i === 0
        ? 'Arrival and Museums'
        : i === 1
          ? 'Impressionist Art and Latin Quarter'
          : i === 2
            ? 'Montmartre and Northern Paris'
            : i === 3
              ? 'Eiffel Tower and Champs-Élysées'
              : 'Day Trip to Versailles',
    activities: modifiedActivities,
    imageUrl: localImagePaths[`paris${i + 1}`],
  };

  mockItinerary.days.push(day);
}

// Save to file
const outputPath = path.join(__dirname, '..', 'public', 'mock-data', 'sample-itinerary.json');

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(mockItinerary, null, 2));
console.log(`Mock itinerary written to ${outputPath}`);

// Create placeholder images for testing
const placeholderImageData = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#6b7280" text-anchor="middle">Image Placeholder</text>
</svg>`;

// Save placeholder images
Object.values(localImagePaths).forEach((imagePath) => {
  const fullPath = path.join(__dirname, '..', 'public', imagePath);
  const imageDir = path.dirname(fullPath);

  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, placeholderImageData);
    console.log(`Created placeholder image: ${imagePath}`);
  }
});
