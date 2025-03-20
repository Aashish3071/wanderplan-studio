import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api-client';

// Mock data to use as fallback if API fails
const MOCK_TRIPS = [
  {
    id: '1',
    title: 'Paris Getaway',
    description: 'A romantic weekend in Paris',
    destination: 'Paris, France',
    startDate: '2023-12-15T00:00:00.000Z',
    endDate: '2023-12-20T00:00:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    isPublic: true,
    status: 'PLANNING',
    userId: 'user1',
    createdAt: '2023-11-01T10:30:00.000Z',
    updatedAt: '2023-11-10T15:45:00.000Z',
  },
  {
    id: '2',
    title: 'Tokyo Adventure',
    description: 'Exploring the vibrant city of Tokyo',
    destination: 'Tokyo, Japan',
    startDate: '2024-03-10T00:00:00.000Z',
    endDate: '2024-03-20T00:00:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    isPublic: true,
    status: 'PLANNING',
    userId: 'user1',
    createdAt: '2023-10-15T08:20:00.000Z',
    updatedAt: '2023-10-25T12:15:00.000Z',
  },
  {
    id: '3',
    title: 'New York City Trip',
    description: 'Business trip to the Big Apple',
    destination: 'New York City, USA',
    startDate: '2024-01-05T00:00:00.000Z',
    endDate: '2024-01-10T00:00:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    isPublic: false,
    status: 'BOOKED',
    userId: 'user1',
    createdAt: '2023-11-20T14:10:00.000Z',
    updatedAt: '2023-11-22T09:30:00.000Z',
  },
];

export interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  isPublic: boolean;
  status: 'PLANNING' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ACTIVE';
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UseTripsOptions {
  initialFetch?: boolean;
  useMockData?: boolean;
}

interface FetchTripsParams {
  status?: string;
  search?: string;
}

export function useTrips(options: UseTripsOptions = { initialFetch: true, useMockData: false }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(
    async (params?: FetchTripsParams) => {
      setIsLoading(true);
      setError(null);

      try {
        // If using mock data, return it immediately
        if (options.useMockData) {
          console.log('Using mock trip data');
          setTimeout(() => {
            setTrips(MOCK_TRIPS as Trip[]);
            setIsLoading(false);
          }, 500); // Add a small delay to simulate API request
          return;
        }

        // Build query parameters if needed
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.search) queryParams.append('search', params.search);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

        const response = await apiClient.get<Trip[]>(`/api/trips${queryString}`);

        if (response.success) {
          setTrips(response.data);
        } else {
          console.warn('API returned error, using mock data as fallback');
          setTrips(MOCK_TRIPS as Trip[]);
          setError(response.error || 'Failed to fetch trips');
        }
      } catch (err) {
        console.error('Error fetching trips:', err);
        console.warn('Using mock data as fallback');
        setTrips(MOCK_TRIPS as Trip[]);
        setError('An error occurred while fetching trips');
      } finally {
        setIsLoading(false);
      }
    },
    [options.useMockData]
  );

  const createTrip = useCallback(
    async (tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => {
      setIsLoading(true);
      setError(null);

      try {
        // If using mock data, simulate API
        if (options.useMockData) {
          const mockTrip = {
            id: `mock-${Date.now()}`,
            ...tripData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Trip;

          setTimeout(() => {
            setTrips((prev) => [...prev, mockTrip]);
            setIsLoading(false);
          }, 500);

          return mockTrip;
        }

        const response = await apiClient.post<Trip>('/api/trips', tripData);

        if (response.success) {
          setTrips((prev) => [...prev, response.data]);
          return response.data;
        } else {
          setError(response.error || 'Failed to create trip');
          return null;
        }
      } catch (err) {
        console.error('Error creating trip:', err);
        setError('An error occurred while creating the trip');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options.useMockData]
  );

  const updateTrip = useCallback(
    async (id: string, tripData: Partial<Trip>) => {
      setIsLoading(true);
      setError(null);

      try {
        // If using mock data, simulate API
        if (options.useMockData) {
          let updatedTrip: Trip | null = null;

          setTrips((prev) => {
            const newTrips = prev.map((trip) => {
              if (trip.id === id) {
                updatedTrip = {
                  ...trip,
                  ...tripData,
                  updatedAt: new Date().toISOString(),
                };
                return updatedTrip;
              }
              return trip;
            });
            return newTrips;
          });

          setTimeout(() => {
            setIsLoading(false);
          }, 500);

          return updatedTrip;
        }

        const response = await apiClient.put<Trip>(`/api/trips/${id}`, tripData);

        if (response.success) {
          setTrips((prev) => prev.map((trip) => (trip.id === id ? response.data : trip)));
          return response.data;
        } else {
          setError(response.error || 'Failed to update trip');
          return null;
        }
      } catch (err) {
        console.error('Error updating trip:', err);
        setError('An error occurred while updating the trip');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options.useMockData]
  );

  const deleteTrip = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // If using mock data, simulate API
        if (options.useMockData) {
          setTrips((prev) => prev.filter((trip) => trip.id !== id));

          setTimeout(() => {
            setIsLoading(false);
          }, 500);

          return true;
        }

        const response = await apiClient.delete<{ success: boolean }>(`/api/trips/${id}`);

        if (response.success) {
          setTrips((prev) => prev.filter((trip) => trip.id !== id));
          return true;
        } else {
          setError(response.error || 'Failed to delete trip');
          return false;
        }
      } catch (err) {
        console.error('Error deleting trip:', err);
        setError('An error occurred while deleting the trip');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [options.useMockData]
  );

  const getTrip = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // If using mock data, simulate API
        if (options.useMockData) {
          const mockTrip = MOCK_TRIPS.find((trip) => trip.id === id) as Trip | undefined;

          setTimeout(() => {
            setIsLoading(false);
          }, 500);

          return mockTrip || null;
        }

        const response = await apiClient.get<Trip>(`/api/trips/${id}`);

        if (response.success) {
          return response.data;
        } else {
          setError(response.error || 'Failed to fetch trip');
          return null;
        }
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError('An error occurred while fetching the trip');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options.useMockData]
  );

  // Fetch trips on initial render if enabled
  useEffect(() => {
    if (options.initialFetch) {
      fetchTrips();
    }
  }, [fetchTrips, options.initialFetch]);

  return {
    trips,
    isLoading,
    error,
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    getTrip,
  };
}
