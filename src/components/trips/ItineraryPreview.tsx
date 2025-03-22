import React from 'react';
import {
  Map,
  Navigation,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import MapView from '@/components/map/MapView';
import { formatCurrency } from '@/lib/utils';

interface Activity {
  title: string;
  description?: string;
  location: string;
  coordinates: { lat: number; lng: number };
  time: string;
  imageUrl?: string;
  cost?: number;
}

interface DayItinerary {
  day: number;
  date: string;
  title: string;
  description?: string;
  activities: Activity[];
  imageUrl?: string;
}

interface ItineraryPreviewProps {
  title: string;
  destination: string;
  summary: string;
  days: DayItinerary[];
  mapCenter: { lat: number; lng: number };
  totalBudget?: number;
  budgetUsed?: number;
  startDate?: string;
  endDate?: string;
  travelers?: number;
  onStartTrip?: () => void;
  loading?: boolean;
}

export default function ItineraryPreview({
  title,
  destination,
  summary,
  days,
  mapCenter,
  totalBudget,
  budgetUsed,
  startDate,
  endDate,
  travelers,
  onStartTrip,
  loading = false,
}: ItineraryPreviewProps) {
  return (
    <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{destination}</span>
        </div>

        {startDate && endDate && (
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-1 h-4 w-4" />
            <span>
              {startDate} - {endDate}
            </span>
          </div>
        )}

        <div className="text-sm text-gray-700">{summary}</div>

        {budgetUsed && totalBudget && (
          <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="text-sm font-medium text-gray-700">Estimated Budget:</span>
            <span className="text-sm font-medium text-primary">
              {formatCurrency(budgetUsed)}
              <span className="ml-1 text-xs text-gray-500">of {formatCurrency(totalBudget)}</span>
            </span>
          </div>
        )}
      </div>

      {/* Trip Map View */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Trip Map</h3>
          <div className="inline-flex items-center text-xs text-gray-500">
            <Navigation className="mr-1 h-4 w-4" />
            <span>Interactive locations map</span>
          </div>
        </div>

        <div className="h-[400px] overflow-hidden rounded-xl border border-gray-200">
          <MapView
            center={mapCenter}
            locations={days.flatMap((day) =>
              day.activities
                .filter((activity) => activity.coordinates && activity.location)
                .map((activity) => ({
                  title: activity.title,
                  location: String(activity.location),
                  coordinates: activity.coordinates,
                  imageUrl: activity.imageUrl,
                  day: day.day,
                  time: activity.time,
                }))
            )}
            height="400px"
          />
        </div>
      </div>

      {/* Interactive Timeline */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-900">Your Itinerary</h3>
        <div className="space-y-6">
          {days.map((day) => (
            <div key={day.day} className="overflow-hidden rounded-xl border border-gray-200">
              {/* Day Header with Image */}
              <div className="relative h-28 w-full">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${day.imageUrl || '/images/placeholder-landscape.jpg'})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20"></div>
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-900">
                        Day {day.day}
                      </span>
                      <h4 className="mt-1 font-medium text-white drop-shadow-md">
                        {day.title || `Day ${day.day}`}
                      </h4>
                    </div>
                    <span className="rounded-md bg-black/30 px-2 py-1 text-xs text-white">
                      {day.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-4 p-4">
                {day.activities.map((activity, idx) => (
                  <div key={idx} className="flex space-x-3">
                    <div className="flex w-12 flex-shrink-0 flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      {idx < day.activities.length - 1 && (
                        <div className="my-1 h-full w-0.5 bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between">
                        <h5 className="font-medium text-gray-900">{activity.title}</h5>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      {activity.location && (
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <MapPin className="mr-1 h-3 w-3" />
                          <span>{activity.location}</span>
                        </div>
                      )}
                      {activity.description && (
                        <p className="mt-2 text-sm text-gray-600">{activity.description}</p>
                      )}
                      {activity.cost && (
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <DollarSign className="mr-1 h-3 w-3" />
                          <span>Estimated cost: {formatCurrency(activity.cost)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Trip Button */}
      {onStartTrip && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onStartTrip}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white shadow-lg transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Start the Trip
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
