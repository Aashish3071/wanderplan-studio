/**
 * A location with coordinates
 */
export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

/**
 * A place of interest
 */
export interface Place {
  id: string;
  name: string;
  description?: string;
  type: string;
  address?: string;
  website?: string;
  phone?: string;
  openingHours?: string;
  rating?: number;
  imageUrl?: string;
  location?: Location;
}

/**
 * An activity in the itinerary
 */
export interface Activity {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  type: string;
  cost?: number;
  transportType?: string;
  itineraryDayId: string;
  placeId?: string;
  locationId?: string;
  place?: Place;
  location?: Location;
  imageUrl?: string;
  rating?: number;
}

/**
 * A day in the itinerary
 */
export interface ItineraryDay {
  id: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tripId: string;
  activities: Activity[];
}

/**
 * Simplified activity for AI generation
 */
export interface SimpleActivity {
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  time: string;
  cost: number;
  imageUrl?: string;
}

/**
 * Simplified day for AI generation
 */
export interface SimpleDay {
  day: number;
  date: string;
  title: string;
  activities: SimpleActivity[];
  imageUrl?: string;
}

/**
 * Complete itinerary for AI generation
 */
export interface AIGeneratedItinerary {
  summary: string;
  mapCenter: { lat: number; lng: number };
  days: SimpleDay[];
}

export interface CreateDayData {
  date: string;
  notes?: string;
  tripId: string;
}

export interface UpdateDayData {
  notes?: string;
}

export interface CreateActivityData {
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  placeId?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    name?: string;
  };
  type: 'TRANSPORT' | 'ACCOMMODATION' | 'ACTIVITY' | 'FOOD' | 'OTHER';
  cost?: number;
  transportType?:
    | 'WALK'
    | 'TRANSIT'
    | 'CAR'
    | 'BIKE'
    | 'TAXI'
    | 'PLANE'
    | 'TRAIN'
    | 'BUS'
    | 'BOAT'
    | 'OTHER';
  imageUrl?: string;
  rating?: number;
}

export interface UpdateActivityData extends Partial<CreateActivityData> {}

export interface ItineraryFormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  interests: string[];
}
