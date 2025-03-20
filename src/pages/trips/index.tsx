import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { Plus, Search, Filter, MapPin, Calendar, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrips } from '@/hooks/useTrips';
import LoadingSpinner from '@/components/ui/loading-spinner';
import TripCard from '@/components/trips/TripCard';
import EmptyState from '@/components/ui/empty-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TripsPage() {
  const { data: session, status: sessionStatus } = useSession({
    required: true,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { trips, isLoading, error, fetchTrips } = useTrips({
    useMockData: true,
    initialFetch: true,
  });

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    fetchTrips({
      status: value === 'all' ? undefined : value,
    });
  };

  // Filter trips based on search term and status
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (sessionStatus === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Trips | WanderPlan Studio</title>
        <meta name="description" content="View and manage all your travel plans" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">My Trips</h1>
            <p className="text-muted-foreground">Manage all your trips in one place</p>
          </div>
          <Button asChild>
            <Link href="/trips/new">
              <Plus className="mr-2 h-4 w-4" />
              New Trip
            </Link>
          </Button>
        </div>

        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trips..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PLANNING">Planning</SelectItem>
              <SelectItem value="BOOKED">Booked</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="mb-4 text-lg font-medium text-destructive">{error}</p>
            <Button variant="outline" onClick={() => fetchTrips()}>
              Try Again
            </Button>
          </div>
        ) : filteredTrips.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-12 w-12 text-muted-foreground" />}
            title="No trips found"
            description={
              searchTerm || statusFilter !== 'all'
                ? 'No trips match your search criteria. Try adjusting your filters.'
                : "You haven't created any trips yet. Start by creating your first trip."
            }
            action={
              searchTerm || statusFilter !== 'all' ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    fetchTrips();
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/trips/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create a Trip
                  </Link>
                </Button>
              )
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
    </>
  );
}
