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

  const { trips, isLoading, error, fetchTrips } = useTrips();
  const [tripFilter, setTripFilter] = useState('all');

  // No need for useEffect to load trips from localStorage
  // Our useTrips hook handles that automatically

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setTripFilter(value);
    fetchTrips({
      status: value === 'all' ? undefined : value,
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
        <div className="mb-8 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {session?.user?.name || 'Traveler'}</h1>
            <p className="text-muted-foreground">Manage your trips and discover new destinations</p>
          </div>
          <Button asChild>
            <Link href="/trips/new">
              <Plus className="mr-2 h-4 w-4" />
              New Trip
            </Link>
          </Button>
        </div>

        {/* Quick Actions Menu */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex flex-col items-center rounded-lg p-4 text-center transition duration-300 hover:bg-accent/50"
            >
              <div
                className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${action.color}`}
              >
                {action.icon}
              </div>
              <span className="text-sm font-medium">{action.title}</span>
            </Link>
          ))}
        </div>

        {/* Upcoming Trips Section */}
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Upcoming Trips</h2>
            <Select value={tripFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trips</SelectItem>
                <SelectItem value="PLANNING">Planning</SelectItem>
                <SelectItem value="BOOKED">Booked</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
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
              icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
              title="No trips found"
              description="You don't have any upcoming trips. Create your first trip to get started."
              action={
                <Button asChild>
                  <Link href="/trips/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create a Trip
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
