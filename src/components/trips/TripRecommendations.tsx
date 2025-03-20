import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Sun, MapPin, Compass, TrendingUp, AlarmClock } from 'lucide-react';
import AccessibleIcon from '../ui/AccessibleIcon';

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  bestTimeToVisit: string;
  popularity: 'trending' | 'popular' | 'hidden-gem';
  tags: string[];
}

interface TripRecommendationsProps {
  userInterests?: string[];
  previousDestinations?: string[];
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  maxItems?: number;
  className?: string;
}

const TripRecommendations: React.FC<TripRecommendationsProps> = ({
  userInterests = [],
  previousDestinations = [],
  season = 'summer',
  maxItems = 3,
  className = '',
}) => {
  // Sample destinations - in a real app, this would come from an API
  const destinations: Destination[] = [
    {
      id: 'd1',
      name: 'Kyoto',
      country: 'Japan',
      description: "Discover ancient temples and beautiful gardens in Japan's former capital.",
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
      bestTimeToVisit: 'Spring (cherry blossoms) or Autumn (fall colors)',
      popularity: 'popular',
      tags: ['culture', 'history', 'food', 'nature'],
    },
    {
      id: 'd2',
      name: 'Barcelona',
      country: 'Spain',
      description: "Experience Gaudí's architecture and Mediterranean beaches.",
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
      bestTimeToVisit: 'Spring or early Autumn',
      popularity: 'popular',
      tags: ['architecture', 'beach', 'food', 'nightlife'],
    },
    {
      id: 'd3',
      name: 'Queenstown',
      country: 'New Zealand',
      description: 'The adventure capital of the world, surrounded by mountains and lakes.',
      image: 'https://images.unsplash.com/photo-1549887534-1541e9326642',
      bestTimeToVisit: 'Summer for hiking, Winter for skiing',
      popularity: 'trending',
      tags: ['adventure', 'nature', 'mountains', 'sports'],
    },
    {
      id: 'd4',
      name: 'Marrakech',
      country: 'Morocco',
      description: 'Explore vibrant markets, palaces and gardens in this ancient city.',
      image: 'https://images.unsplash.com/photo-1560095633-8c47d0b96e43',
      bestTimeToVisit: 'Spring or Autumn',
      popularity: 'trending',
      tags: ['culture', 'market', 'history', 'food'],
    },
    {
      id: 'd5',
      name: 'Ljubljana',
      country: 'Slovenia',
      description: 'A charming capital with beautiful river views and nearby natural attractions.',
      image: 'https://images.unsplash.com/photo-1596564809790-12253fbf5c93',
      bestTimeToVisit: 'Spring through Summer',
      popularity: 'hidden-gem',
      tags: ['architecture', 'nature', 'culture', 'affordable'],
    },
  ];

  // Generate recommendations based on user preferences
  const getRecommendations = () => {
    let recommendations = [...destinations];

    // Filter out previously visited destinations
    if (previousDestinations.length > 0) {
      recommendations = recommendations.filter((dest) => !previousDestinations.includes(dest.name));
    }

    // Sort by interest match
    if (userInterests.length > 0) {
      recommendations.sort((a, b) => {
        const aMatches = a.tags.filter((tag) => userInterests.includes(tag)).length;
        const bMatches = b.tags.filter((tag) => userInterests.includes(tag)).length;
        return bMatches - aMatches;
      });
    }

    // Seasonal adjustments
    recommendations = recommendations.filter((dest) => {
      switch (season) {
        case 'spring':
          return dest.bestTimeToVisit.toLowerCase().includes('spring');
        case 'summer':
          return dest.bestTimeToVisit.toLowerCase().includes('summer');
        case 'autumn':
          return dest.bestTimeToVisit.toLowerCase().includes('autumn');
        case 'winter':
          return dest.bestTimeToVisit.toLowerCase().includes('winter');
        default:
          return true;
      }
    });

    // If no seasonal matches found, include all destinations
    if (recommendations.length === 0) {
      recommendations = [...destinations];
    }

    // Limit number of recommendations
    return recommendations.slice(0, maxItems);
  };

  const recommendedDestinations = getRecommendations();

  const getPopularityIcon = (popularity: Destination['popularity']) => {
    switch (popularity) {
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case 'popular':
        return <Sun className="h-4 w-4 text-amber-500" />;
      case 'hidden-gem':
        return <Compass className="h-4 w-4 text-emerald-500" />;
      default:
        return null;
    }
  };

  const getPopularityText = (popularity: Destination['popularity']) => {
    switch (popularity) {
      case 'trending':
        return 'Trending now';
      case 'popular':
        return 'Popular destination';
      case 'hidden-gem':
        return 'Hidden gem';
      default:
        return '';
    }
  };

  return (
    <div className={`trip-recommendations ${className}`}>
      <h2 className="mb-6 text-2xl font-bold">Recommended For You</h2>

      {recommendedDestinations.length === 0 ? (
        <div className="rounded-xl bg-muted/30 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Globe className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No recommendations yet</h3>
          <p className="text-muted-foreground">
            Add some interests to your profile to get personalized trip recommendations.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendedDestinations.map((destination) => (
            <Link
              href={`/explore/${destination.id}`}
              key={destination.id}
              className="card card-hover group overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={`${destination.image}?auto=format&w=600&q=80`}
                  alt={`${destination.name}, ${destination.country}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="mb-1 flex items-center text-white">
                    <MapPin className="mr-1 h-4 w-4 text-secondary" />
                    <h3 className="text-lg font-semibold">{destination.name}</h3>
                    <span className="mx-1 text-white/70">•</span>
                    <span className="text-sm text-white/90">{destination.country}</span>
                  </div>

                  <div className="flex items-center text-xs text-white/90">
                    <div className="mr-3 flex items-center">
                      <AccessibleIcon label={getPopularityText(destination.popularity)}>
                        {getPopularityIcon(destination.popularity)}
                      </AccessibleIcon>
                      <span className="ml-1">{getPopularityText(destination.popularity)}</span>
                    </div>

                    <div className="flex items-center">
                      <AccessibleIcon label="Best time to visit">
                        <AlarmClock className="h-4 w-4 text-white/80" />
                      </AccessibleIcon>
                      <span className="ml-1">{destination.bestTimeToVisit}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                  {destination.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {destination.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-end">
                  <span className="flex items-center text-sm font-medium text-primary group-hover:underline">
                    Explore destination
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripRecommendations;
