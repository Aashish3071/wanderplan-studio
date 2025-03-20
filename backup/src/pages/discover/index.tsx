import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Star,
  Filter,
  ChevronDown,
  Heart,
  ExternalLink,
  Coffee,
  Utensils,
  Building,
  Landmark,
  Hotel,
  Globe,
  Plus,
} from 'lucide-react';

// Sample destination data for the UI
const popularDestinations = [
  {
    id: 1,
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80',
    description:
      'The City of Light offers iconic architecture, exquisite cuisine, and artistic treasures.',
    tripCount: 2345,
  },
  {
    id: 2,
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80',
    description:
      'A dazzling blend of ultramodern and traditional, from neon-lit skyscrapers to historic temples.',
    tripCount: 1987,
  },
  {
    id: 3,
    name: 'New York',
    country: 'United States',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80',
    description:
      'The Big Apple boasts iconic landmarks, diverse neighborhoods, and world-class entertainment.',
    tripCount: 3120,
  },
  {
    id: 4,
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&q=80',
    description: 'Famous for stunning sunsets, white-washed buildings, and crystal-clear waters.',
    tripCount: 1540,
  },
];

// Sample place data for the UI
const trendingPlaces = [
  {
    id: 1,
    name: 'Louvre Museum',
    location: 'Paris, France',
    type: 'MUSEUM',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 1250,
    priceRange: 'MODERATE',
  },
  {
    id: 2,
    name: 'Shibuya Crossing',
    location: 'Tokyo, Japan',
    type: 'ATTRACTION',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80',
    rating: 4.5,
    reviews: 980,
    priceRange: 'FREE',
  },
  {
    id: 3,
    name: 'Central Park',
    location: 'New York, USA',
    type: 'PARK',
    image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 1875,
    priceRange: 'FREE',
  },
  {
    id: 4,
    name: 'Santorini Caldera',
    location: 'Santorini, Greece',
    type: 'VIEWPOINT',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 1120,
    priceRange: 'FREE',
  },
  {
    id: 5,
    name: 'Eiffel Tower',
    location: 'Paris, France',
    type: 'LANDMARK',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 2230,
    priceRange: 'MODERATE',
  },
  {
    id: 6,
    name: 'Sensoji Temple',
    location: 'Tokyo, Japan',
    type: 'TEMPLE',
    image: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&q=80',
    rating: 4.5,
    reviews: 870,
    priceRange: 'FREE',
  },
];

// Convert price range to symbols
const getPriceRangeSymbol = (priceRange: string) => {
  switch (priceRange) {
    case 'FREE':
      return 'Free';
    case 'INEXPENSIVE':
      return '$';
    case 'MODERATE':
      return '$$';
    case 'EXPENSIVE':
      return '$$$';
    case 'VERY_EXPENSIVE':
      return '$$$$';
    default:
      return '$$';
  }
};

// Get icon based on place type
const getPlaceIcon = (type: string) => {
  switch (type) {
    case 'RESTAURANT':
      return <Utensils className="h-4 w-4" />;
    case 'CAFE':
      return <Coffee className="h-4 w-4" />;
    case 'HOTEL':
      return <Hotel className="h-4 w-4" />;
    case 'MUSEUM':
      return <Building className="h-4 w-4" />;
    case 'LANDMARK':
    case 'ATTRACTION':
    case 'VIEWPOINT':
      return <Landmark className="h-4 w-4" />;
    default:
      return <MapPin className="h-4 w-4" />;
  }
};

export default function Discover() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Attractions', 'Restaurants', 'Hotels', 'Activities'];

  return (
    <>
      <Head>
        <title>Discover Places | WanderPlan</title>
      </Head>

      <div className="min-h-screen bg-background pb-16">
        {/* Hero Search Section */}
        <div className="bg-gradient-primary relative overflow-hidden py-20 text-white">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent/20 blur-3xl"></div>

          <div className="container-custom relative z-10">
            <div className="max-w-3xl">
              <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                Discover Amazing Places
              </h1>
              <p className="mb-8 text-lg text-white/90 md:text-xl">
                Find the perfect destinations, attractions, and hidden gems for your next adventure
              </p>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search for destinations, attractions, or experiences..."
                  className="w-full rounded-xl border-0 bg-white/95 py-3 pl-11 pr-4 text-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedFilter === filter
                        ? 'bg-white text-primary shadow-md'
                        : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
                    }`}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
                <button className="flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/30">
                  <Filter className="mr-1.5 h-4 w-4" />
                  More Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom mt-12">
          {/* Popular Destinations */}
          <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Popular Destinations</h2>
              <Link
                href="/discover/destinations"
                className="group flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                View all destinations
                <ChevronDown className="rotate-270 ml-1 h-4 w-4 text-primary/70 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {popularDestinations.map((destination) => (
                <Link key={destination.id} href={`/discover/destinations/${destination.id}`}>
                  <div className="card-hover group overflow-hidden rounded-xl bg-card shadow-md">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-60"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-white">{destination.name}</h3>
                          <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-foreground">
                            {destination.tripCount} trips
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center text-sm text-muted-foreground">
                        <Globe className="mr-1.5 h-4 w-4 text-primary/70" />
                        {destination.country}
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {destination.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Trending Places */}
          <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Trending Places</h2>
              <Link
                href="/discover/places"
                className="group flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                View all places
                <ChevronDown className="rotate-270 ml-1 h-4 w-4 text-primary/70 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trendingPlaces.map((place) => (
                <div
                  key={place.id}
                  className="card-hover group overflow-hidden rounded-xl bg-card shadow-sm"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-muted-foreground shadow-sm transition-colors hover:text-rose-500">
                      <Heart className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-4 text-white">
                      <div className="flex items-center">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/80 text-white">
                          {getPlaceIcon(place.type)}
                        </span>
                        <span className="ml-1.5 text-xs font-medium uppercase">
                          {place.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                      {place.name}
                    </h3>
                    <div className="mb-3 flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4 text-primary/70" />
                      {place.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex h-6 items-center rounded-full bg-amber-50 px-2">
                          <Star className="h-3.5 w-3.5 text-amber-500" />
                          <span className="ml-1 text-sm font-medium text-foreground">
                            {place.rating}
                          </span>
                        </div>
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          ({place.reviews})
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {getPriceRangeSymbol(place.priceRange)}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-between border-t border-border/50 pt-3">
                      <Link
                        href={`/discover/places/${place.id}`}
                        className="flex items-center text-sm text-primary transition-colors hover:text-primary/80"
                      >
                        View details <ChevronDown className="rotate-270 ml-1 h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/trips/new?placeId=${place.id}`}
                        className="flex items-center text-sm text-primary transition-colors hover:text-primary/80"
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Add to trip
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Travel Collections */}
          <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Collections For You</h2>
              <Link
                href="/discover/collections"
                className="group flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                View all collections
                <ChevronDown className="rotate-270 ml-1 h-4 w-4 text-primary/70 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="card-hover group overflow-hidden rounded-xl shadow-sm">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
                    alt="Top Restaurants"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-b from-transparent via-foreground/20 to-foreground/80">
                    <div className="p-5 text-white">
                      <h3 className="text-xl font-semibold">Top Restaurants</h3>
                      <p className="mt-1 text-sm text-white/90">25 amazing dining experiences</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-hover group overflow-hidden rounded-xl shadow-sm">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&q=80"
                    alt="Best Views"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-b from-transparent via-foreground/20 to-foreground/80">
                    <div className="p-5 text-white">
                      <h3 className="text-xl font-semibold">Best Views</h3>
                      <p className="mt-1 text-sm text-white/90">18 breathtaking landscapes</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-hover group overflow-hidden rounded-xl shadow-sm">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&q=80"
                    alt="Off the Beaten Path"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-b from-transparent via-foreground/20 to-foreground/80">
                    <div className="p-5 text-white">
                      <h3 className="text-xl font-semibold">Off the Beaten Path</h3>
                      <p className="mt-1 text-sm text-white/90">12 hidden gems</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Community Tips */}
          <section className="mb-16 rounded-2xl bg-muted/50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Tips from our Community</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-primary/10 h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-foreground">Sarah M.</h3>
                      <span className="text-sm text-muted-foreground">Paris, France</span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      "Skip the lines at the Louvre by entering through the Carrousel du Louvre
                      shopping mall entrance. It's much less crowded than the main pyramid
                      entrance!"
                    </p>
                    <div className="mt-3 flex items-center text-sm text-muted-foreground">
                      <span className="flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        <Star className="mr-1 h-3 w-3" /> Helpful for 248 travelers
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-primary/10 h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-foreground">James T.</h3>
                      <span className="text-sm text-muted-foreground">Tokyo, Japan</span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      "The best time to visit Shibuya Crossing is just after sunset when all the
                      neon lights are on. Go to the Starbucks on the second floor for a perfect
                      view!"
                    </p>
                    <div className="mt-3 flex items-center text-sm text-muted-foreground">
                      <span className="flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        <Star className="mr-1 h-3 w-3" /> Helpful for 187 travelers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <section className="rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8 text-center">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-2 text-2xl font-bold text-foreground">Get Inspired</h2>
              <p className="mb-6 text-muted-foreground">
                Subscribe to our newsletter for travel tips, destination guides, and exclusive deals
              </p>
              <div className="mx-auto flex max-w-md">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow rounded-l-xl border-y border-l border-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button className="bg-gradient-primary rounded-r-xl px-6 py-2.5 font-medium text-white transition-shadow hover:shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
