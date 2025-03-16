import axios from "axios";

// Use import.meta.env instead of process.env for Vite projects
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authApi = {
  register: (data: any) => api.post("/users/register", data),
  login: (data: any) => api.post("/users/login", data),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: any) => api.put("/users/profile", data),
  requestPasswordReset: (email: string) =>
    api.post("/users/request-password-reset", { email }),
  resetPassword: (token: string, newPassword: string) =>
    api.post("/users/reset-password", { token, newPassword }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/users/change-password", { currentPassword, newPassword }),
};

// Trip API
export const tripApi = {
  getAll: () => api.get("/trips"),
  getById: (id: string) => api.get(`/trips/${id}`),
  create: (data: any) => api.post("/trips", data),
  update: (id: string, data: any) => api.put(`/trips/${id}`, data),
  delete: (id: string) => api.delete(`/trips/${id}`),
};

// Itinerary API
export const itineraryApi = {
  getByTripId: (tripId: string) => api.get(`/itineraries/trip/${tripId}`),
  create: (tripId: string, data: any) =>
    api.post(`/itineraries/trip/${tripId}`, data),
  update: (id: string, data: any) => api.put(`/itineraries/${id}`, data),
  delete: (id: string) => api.delete(`/itineraries/${id}`),
};

// Recommendation API
export const recommendationApi = {
  generateItinerary: (data: any) => api.post("/recommendations/generate", data),
  getBudgetRecommendation: (data: any) =>
    api.post("/recommendations/budget", data),
  refineItinerary: (data: any) => api.post("/recommendations/refine", data),
  getActivities: (data: any) => api.post("/recommendations/activities", data),
  getAccommodations: (data: any) =>
    api.post("/recommendations/accommodations", data),
};

// Enums
export enum TravelStyle {
  BUDGET = "BUDGET",
  COMFORT = "COMFORT",
  LUXURY = "LUXURY",
  ADVENTURE = "ADVENTURE",
  CULTURAL = "CULTURAL",
  RELAXATION = "RELAXATION",
}

export enum TripStatus {
  PLANNING = "PLANNING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ActivityType {
  SIGHTSEEING = "SIGHTSEEING",
  DINING = "DINING",
  SHOPPING = "SHOPPING",
  ENTERTAINMENT = "ENTERTAINMENT",
  TRANSPORTATION = "TRANSPORTATION",
  ACCOMMODATION = "ACCOMMODATION",
  OTHER = "OTHER",
}

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  preferences?: {
    travelStyle?: string[];
    interests?: string[];
    accommodationPreferences?: string[];
    dietaryRestrictions?: string[];
    accessibility?: string[];
  };
}

export interface Trip {
  _id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelStyle: TravelStyle;
  status: TripStatus;
  interests?: string[];
  accommodation?: {
    type: string;
    priceRange: string;
    amenities?: string[];
  };
  transportation?: {
    flight?: string;
    local?: string;
  };
  notes?: string;
  itinerary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  name: string;
  type: ActivityType;
  location?: string;
  description?: string;
  startTime: string; // ISO string
  duration: number; // in minutes
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Day {
  _id: string;
  date: string; // ISO string
  title?: string;
  description?: string;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetBreakdown {
  accommodation: number;
  transportation: number;
  food: number;
  activities: number;
  shopping: number;
  other: number;
}

export interface Itinerary {
  _id: string;
  tripId: string;
  destination: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  days: Day[];
  budgetBreakdown?: BudgetBreakdown;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default api;
