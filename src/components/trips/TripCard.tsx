import { Calendar, MapPin, ArrowRight, Cloud, Sun, CloudRain, Clock } from 'lucide-react';
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
        return 'bg-amber-100 text-amber-800';
      case 'BOOKED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-emerald-100 text-emerald-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Mock function to get a random weather icon for demo purposes
  const getWeatherIcon = () => {
    const icons = [
      <Sun key="sun" className="h-5 w-5 text-amber-500" />,
      <Cloud key="cloud" className="h-5 w-5 text-blue-400" />,
      <CloudRain key="rain" className="h-5 w-5 text-blue-500" />,
    ];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  // Mock function to get a random temperature for demo purposes
  const getTemperature = () => {
    return `${Math.floor(Math.random() * 30) + 10}°C`;
  };

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative h-56">
        {trip.coverImage ? (
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-primary/40 to-secondary/40">
            <span className="text-4xl font-bold text-white">{trip.destination.charAt(0)}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

        <div
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor()}`}
        >
          {formatStatus(trip.status)}
        </div>
      </div>

      <div className="p-5">
        <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">{trip.title}</h3>

        <div className="mb-3 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
          <span className="line-clamp-1 text-sm">{trip.destination}</span>
        </div>

        <div className="mb-4 flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
          <span className="text-sm">
            {formatDateString(trip.startDate)} - {formatDateString(trip.endDate)}
          </span>
        </div>

        {/* Trip summary with duration and weather */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-muted/50 p-2">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{calculateDuration()} days</span>
          </div>
          <div className="flex items-center gap-1">
            {getWeatherIcon()}
            <span className="text-sm font-medium">{getTemperature()}</span>
          </div>
        </div>

        {/* Description preview */}
        {trip.description && (
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{trip.description}</p>
        )}

        <div className="flex items-center justify-end">
          <div className="rounded-full bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
