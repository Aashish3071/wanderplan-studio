import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Globe, Search, MapPin, Compass, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrips } from '@/hooks/useTrips';
import TripCard from '@/components/trips/TripCard';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const popularDestinations = [
  {
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
  },
  {
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
  },
  {
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
  },
];

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const { trips } = useTrips({
    useMockData: true,
    initialFetch: true,
  });

  // Get public trips (in a real app, you would filter by isPublic=true)
  const publicTrips = trips.filter((trip) => trip.isPublic).slice(0, 3);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Explore | WanderPlan Studio</title>
        <meta name="description" content="Discover new destinations and travel inspiration" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 rounded-2xl bg-gradient-to-r from-primary/80 to-blue-600/80 p-8 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold">Discover Your Next Adventure</h1>
            <p className="mb-6 text-lg">
              Explore popular destinations, trending trips, and travel inspiration
            </p>
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search destinations..."
                className="h-12 w-full pl-10 text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Popular Destinations</h2>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Globe className="h-4 w-4" /> View All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {popularDestinations.map((destination, index) => (
              <Link
                href={`/explore/destination?name=${destination.name}`}
                key={index}
                className="group overflow-hidden rounded-lg"
              >
                <div className="relative h-40 w-full overflow-hidden rounded-lg">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url(${destination.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div className="absolute bottom-0 left-0 p-3 text-white">
                    <h3 className="text-lg font-medium">{destination.name}</h3>
                    <p className="text-sm text-gray-200">{destination.country}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Trips */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Trending Trips</h2>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" /> View All
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publicTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        {/* Travel Insights */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Travel Insights</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-primary" /> Travel Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    • Pack versatile clothing that can be layered
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    • Always keep digital copies of important documents
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    • Learn a few phrases in the local language
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Seasonal Picks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    • Autumn foliage in Kyoto, Japan
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    • Winter festivals in Quebec City, Canada
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    • Spring tulips in Amsterdam, Netherlands
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Hidden Gems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    • The colorful village of Burano, Italy
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    • The ancient city of Petra, Jordan
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    • The Plitvice Lakes National Park, Croatia
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
