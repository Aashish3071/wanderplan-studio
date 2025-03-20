export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  interests: string[];
  days: ItineraryDay[];
  created_at: string;
  updated_at: string;
}

export interface ItineraryDay {
  id: string;
  itinerary_id: string;
  day_number: number;
  activities: Activity[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  itinerary_day_id: string;
  title: string;
  description: string | null;
  location: Location;
  start_time: string;
  end_time: string;
  type: ActivityType;
  cost: number;
  booking_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  place_id: string | null;
  type: LocationType;
  created_at: string;
  updated_at: string;
}

export enum ActivityType {
  SIGHTSEEING = "sightseeing",
  DINING = "dining",
  TRANSPORTATION = "transportation",
  ACCOMMODATION = "accommodation",
  ENTERTAINMENT = "entertainment",
  SHOPPING = "shopping",
  OTHER = "other",
}

export enum LocationType {
  POINT_OF_INTEREST = "point_of_interest",
  RESTAURANT = "restaurant",
  HOTEL = "hotel",
  AIRPORT = "airport",
  STATION = "station",
  SHOPPING = "shopping",
  OTHER = "other",
}
