'use client';

import React from 'react';
import MapView, { MapLocation } from '@/components/map/MapView';
import ItineraryPreview from '@/components/trips/ItineraryPreview';

export default function MapDemoPage() {
  // Sample data for a Paris trip
  const demoLocations: MapLocation[] = [
    {
      title: 'Eiffel Tower',
      location: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
      coordinates: { lat: 48.8584, lng: 2.2945 },
      day: 1,
      time: '10:00 AM',
    },
    {
      title: 'Louvre Museum',
      location: 'Rue de Rivoli, 75001 Paris, France',
      coordinates: { lat: 48.8606, lng: 2.3376 },
      day: 1,
      time: '2:00 PM',
    },
    {
      title: 'Notre-Dame Cathedral',
      location: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, France',
      coordinates: { lat: 48.853, lng: 2.3499 },
      day: 2,
      time: '9:30 AM',
    },
    {
      title: 'Montmartre',
      location: 'Montmartre, 75018 Paris, France',
      coordinates: { lat: 48.8867, lng: 2.3431 },
      day: 2,
      time: '2:30 PM',
    },
    {
      title: 'Arc de Triomphe',
      location: 'Place Charles de Gaulle, 75008 Paris, France',
      coordinates: { lat: 48.8738, lng: 2.295 },
      day: 3,
      time: '11:00 AM',
    },
  ];

  // Sample data for the itinerary preview
  const itineraryData = {
    title: 'Romantic Paris Adventure',
    destination: 'Paris, France',
    summary:
      'Experience the magic of Paris with this 3-day itinerary covering iconic landmarks, world-class museums, and charming neighborhoods.',
    startDate: 'Apr 15, 2023',
    endDate: 'Apr 18, 2023',
    mapCenter: { lat: 48.8566, lng: 2.3522 },
    totalBudget: 2000,
    budgetUsed: 1650,
    travelers: 2,
    days: [
      {
        day: 1,
        date: 'Apr 15, 2023',
        title: 'Classic Landmarks',
        imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f',
        activities: [
          {
            title: 'Eiffel Tower Visit',
            description: 'Ascend the iconic Eiffel Tower for breathtaking views of Paris.',
            location: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
            coordinates: { lat: 48.8584, lng: 2.2945 },
            time: '10:00 AM',
            cost: 75,
          },
          {
            title: 'Lunch at Café Constant',
            description:
              'Enjoy traditional French cuisine at this charming bistro near the Eiffel Tower.',
            location: '139 Rue Saint-Dominique, 75007 Paris, France',
            coordinates: { lat: 48.8574, lng: 2.3082 },
            time: '12:30 PM',
            cost: 80,
          },
          {
            title: 'Louvre Museum',
            description: "Explore one of the world's largest art museums, home to the Mona Lisa.",
            location: 'Rue de Rivoli, 75001 Paris, France',
            coordinates: { lat: 48.8606, lng: 2.3376 },
            time: '2:00 PM',
            cost: 30,
          },
        ],
      },
      {
        day: 2,
        date: 'Apr 16, 2023',
        title: 'Cultural Exploration',
        imageUrl: 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94',
        activities: [
          {
            title: 'Notre-Dame Cathedral',
            description:
              'Visit the renowned Gothic cathedral (exterior view during reconstruction).',
            location: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, France',
            coordinates: { lat: 48.853, lng: 2.3499 },
            time: '9:30 AM',
            cost: 0,
          },
          {
            title: 'Lunch in Le Marais',
            description: 'Enjoy lunch in the trendy Le Marais district.',
            location: 'Le Marais, 75004 Paris, France',
            coordinates: { lat: 48.8597, lng: 2.3622 },
            time: '12:30 PM',
            cost: 60,
          },
          {
            title: 'Montmartre and Sacré-Cœur',
            description:
              'Explore the artistic neighborhood of Montmartre and visit the Sacré-Cœur Basilica.',
            location: 'Montmartre, 75018 Paris, France',
            coordinates: { lat: 48.8867, lng: 2.3431 },
            time: '2:30 PM',
            cost: 0,
          },
        ],
      },
      {
        day: 3,
        date: 'Apr 17, 2023',
        title: 'Champs-Élysées & Luxury',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
        activities: [
          {
            title: 'Arc de Triomphe',
            description: 'Visit the Arc de Triomphe and enjoy panoramic views from the top.',
            location: 'Place Charles de Gaulle, 75008 Paris, France',
            coordinates: { lat: 48.8738, lng: 2.295 },
            time: '11:00 AM',
            cost: 15,
          },
          {
            title: 'Shopping on Champs-Élysées',
            description: 'Stroll down the famous avenue and enjoy some luxury shopping.',
            location: 'Avenue des Champs-Élysées, 75008 Paris, France',
            coordinates: { lat: 48.8698, lng: 2.3075 },
            time: '1:30 PM',
            cost: 200,
          },
          {
            title: 'Seine River Cruise',
            description: 'End your Paris adventure with a romantic dinner cruise on the Seine.',
            location: 'Port de la Conférence, 75008 Paris, France',
            coordinates: { lat: 48.8637, lng: 2.3096 },
            time: '7:30 PM',
            cost: 150,
          },
        ],
      },
    ],
  };

  const handleStartTrip = () => {
    alert('Starting the trip!');
  };

  return (
    <div className="container mx-auto space-y-8 p-4">
      <h1 className="mb-8 text-center text-3xl font-bold">Google Maps Integration Demo</h1>

      <div className="grid grid-cols-1 gap-8">
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Itinerary with Map Integration</h2>
          <ItineraryPreview
            title={itineraryData.title}
            destination={itineraryData.destination}
            summary={itineraryData.summary}
            days={itineraryData.days}
            mapCenter={itineraryData.mapCenter}
            totalBudget={itineraryData.totalBudget}
            budgetUsed={itineraryData.budgetUsed}
            startDate={itineraryData.startDate}
            endDate={itineraryData.endDate}
            travelers={itineraryData.travelers}
            onStartTrip={handleStartTrip}
          />
        </div>
      </div>
    </div>
  );
}
