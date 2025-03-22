import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  ChevronRight,
  Clock,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Globe,
  Users,
  UserCircle,
  Navigation,
  Sparkles,
  Settings,
  Search,
  Plus,
  CircleUser,
  BookOpen,
  Briefcase,
  Bookmark,
  FileEdit,
  Map,
} from 'lucide-react';
import AIGenerateTrip from '@/components/trips/AIGenerateTrip';
import TripCard from '@/components/trips/TripCard';
import { Button } from '@/components/ui/button';
import { useTrips } from '@/hooks/useTrips';
import LoadingSpinner from '@/components/ui/loading-spinner';
import EmptyState from '@/components/ui/empty-state';
import EmptyTripsIllustration from '@/components/illustrations/EmptyTripsIllustration';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Define the Trip type
interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  coverImage?: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED';
  isPublic: boolean;
  createdAt: string;
}

// Define a type for the itinerary
interface Itinerary {
  activities: {
    name: string;
    time: string;
    cost: number;
    description?: string;
    image?: string;
    location?: string;
    category?: string;
  }[];
  totalCost: number;
  map: string;
  days: {
    date: string;
    activities: {
      name: string;
      time: string;
      cost: number;
      description?: string;
      image?: string;
      location?: string;
      category?: string;
    }[];
    totalCost: number;
  }[];
  packingTips?: string[];
  localInsights?: string[];
  travelWarnings?: string[];
}

// Quick access menu items
const quickActions = [
  {
    title: 'New Trip',
    icon: <Plus className="h-5 w-5" />,
    href: '/trips/new',
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'My Trips',
    icon: <Briefcase className="h-5 w-5" />,
    href: '/trips',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'AI Generate',
    icon: <Sparkles className="h-5 w-5" />,
    href: '/trips/ai-generate',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    title: 'Explore',
    icon: <Globe className="h-5 w-5" />,
    href: '/explore',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    title: 'Map View',
    icon: <Map className="h-5 w-5" />,
    href: '/map',
    color: 'bg-amber-500/10 text-amber-500',
  },
  {
    title: 'Trip Planner',
    icon: <FileEdit className="h-5 w-5" />,
    href: '/planner',
    color: 'bg-cyan-500/10 text-cyan-500',
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Redirect to login page
      router.push('/auth/signin');
    },
  });

  const { trips, isLoading, error, fetchTrips } = useTrips({ useMockData: true });
  const [tripFilter, setTripFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setTripFilter(value);
    fetchTrips({
      status: value === 'all' ? undefined : value,
      search: searchQuery,
    });
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrips({
      status: tripFilter === 'all' ? undefined : tripFilter,
      search: searchQuery,
    });
  };

  // Filter trips based on status
  const filteredTrips = trips;

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
        <title>Dashboard | WanderPlan Studio</title>
        <meta name="description" content="View and manage your travel plans" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header with welcome message and search */}
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {session?.user?.name || 'Traveler'}</h1>
            <p className="text-muted-foreground">Manage your trips and discover new destinations</p>
          </div>

          {/* Search bar */}
          <div className="flex w-full md:w-1/3">
            <form onSubmit={handleSearch} className="relative flex w-full">
              <input
                type="text"
                placeholder="Search your trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 flex h-full items-center justify-center px-3 text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Main dashboard layout */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left sidebar with Trip Tools */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-3">
                <CardTitle className="text-lg">Trip Tools</CardTitle>
                <CardDescription>Helpful planning resources</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  <li>
                    <Link
                      href="/plan/ai"
                      className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20 text-purple-600">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">AI Trip Planner</p>
                        <p className="text-xs text-muted-foreground">
                          Generate itineraries with AI
                        </p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/explore"
                      className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20 text-green-600">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Explore</p>
                        <p className="text-xs text-muted-foreground">Discover new destinations</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/map"
                      className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20 text-amber-600">
                        <Map className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Map View</p>
                        <p className="text-xs text-muted-foreground">Visualize on a map</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/trips"
                      className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-blue-600">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">All Trips</p>
                        <p className="text-xs text-muted-foreground">View your complete list</p>
                      </div>
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Center content with trips */}
          <div className="lg:col-span-9">
            {/* Upcoming Trips Section */}
            <div className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Upcoming Trips</h2>
                <div className="flex items-center gap-2">
                  <Select value={tripFilter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trips</SelectItem>
                      <SelectItem value="PLANNING">Planning</SelectItem>
                      <SelectItem value="BOOKED">Booked</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                    <Link href="/trips/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Trip
                    </Link>
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex h-60 items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <Card className="border-destructive/50 bg-destructive/10">
                  <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>Failed to load your trips</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{error}</p>
                    <Button variant="outline" className="mt-4" onClick={() => fetchTrips()}>
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              ) : filteredTrips.length === 0 ? (
                <EmptyState
                  illustration={<EmptyTripsIllustration className="w-full max-w-[200px]" />}
                  title="No trips found"
                  description="Ready for your next adventure? Create a trip and let the journey begin!"
                  action={
                    <Button asChild className="mt-2">
                      <Link href="/trips/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Trip
                      </Link>
                    </Button>
                  }
                  className="py-16"
                />
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Button for trip creation */}
        <div className="fixed bottom-6 right-6 sm:hidden">
          <Button
            asChild
            size="lg"
            className="h-14 w-14 rounded-full p-4 shadow-lg hover:shadow-xl"
          >
            <Link href="/trips/new">
              <Plus className="h-6 w-6" />
              <span className="sr-only">Create new trip</span>
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}
