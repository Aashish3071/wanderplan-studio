import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Coffee,
  Utensils,
  Bed,
  Bus,
  Map,
  Camera,
  Compass,
} from 'lucide-react';

export interface TimelineEvent {
  id: string;
  title: string;
  time: string;
  type: 'attraction' | 'meal' | 'transport' | 'accommodation' | 'activity';
  location?: string;
  description?: string;
  duration?: string;
  icon?: React.ReactNode;
}

export interface TripDay {
  date: string;
  events: TimelineEvent[];
}

interface TripTimelineProps {
  days: TripDay[];
  className?: string;
}

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'attraction':
      return <Camera className="h-5 w-5 text-primary" />;
    case 'meal':
      return <Utensils className="h-5 w-5 text-secondary" />;
    case 'transport':
      return <Bus className="h-5 w-5 text-accent" />;
    case 'accommodation':
      return <Bed className="h-5 w-5 text-emerald-500" />;
    case 'activity':
      return <Compass className="h-5 w-5 text-amber-500" />;
    default:
      return <MapPin className="h-5 w-5 text-primary" />;
  }
};

const TripTimeline: React.FC<TripTimelineProps> = ({ days, className = '' }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className={`trip-timeline ${className}`}>
      {days.map((day, dayIndex) => (
        <div key={day.date} className="mb-8 last:mb-0">
          <div className="mb-4 flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="ml-3 text-xl font-semibold">
              Day {dayIndex + 1} - {formatDate(day.date)}
            </h3>
          </div>

          <div className="timeline-events ml-5 border-l-2 border-primary/20 pl-10">
            {day.events.map((event, eventIndex) => (
              <div
                key={event.id}
                className={`animate-fadeIn relative mb-8 transition-all last:mb-0`}
                style={{ animationDelay: `${eventIndex * 100}ms` }}
              >
                <div className="absolute -left-16 mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary/40 bg-white">
                  {event.icon || getEventIcon(event.type)}
                </div>

                <div className="card p-4 transition-all hover:shadow-md">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{event.time}</span>
                      {event.duration && <span className="ml-2">({event.duration})</span>}
                    </div>
                  </div>

                  {event.location && (
                    <div className="mb-2 flex items-start">
                      <MapPin className="mr-1.5 mt-0.5 h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{event.location}</span>
                    </div>
                  )}

                  {event.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TripTimeline;
