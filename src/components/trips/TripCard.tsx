import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Trip } from '@/hooks/useTrips';
import { formatDateString } from '@/lib/utils';

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  // Calculate trip duration in days
  const calculateDuration = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status badge color based on trip status
  const getStatusColor = () => {
    switch (trip.status) {
      case 'PLANNING':
        return 'text-amber-600';
      case 'BOOKED':
        return 'text-blue-600';
      case 'IN_PROGRESS':
        return 'text-emerald-600';
      case 'COMPLETED':
        return 'text-purple-600';
      case 'CANCELLED':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative h-48">
        {trip.coverImage ? (
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-primary/40 to-secondary/40">
            <span className="text-2xl font-bold text-white">{trip.destination.charAt(0)}</span>
          </div>
        )}

        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
          <span className={getStatusColor()}>{formatStatus(trip.status)}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="mb-2 line-clamp-1 text-xl font-semibold">{trip.title}</h3>

        <div className="mb-3 flex items-center text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4 text-primary" />
          <span className="line-clamp-1 text-sm">{trip.destination}</span>
        </div>

        <div className="mb-4 flex items-center text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4 text-primary" />
          <span className="text-sm">
            {formatDateString(trip.startDate)} - {formatDateString(trip.endDate)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{calculateDuration()} days</span>

          <div className="rounded-full bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
