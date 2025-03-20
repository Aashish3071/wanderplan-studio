import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface ItineraryDay {
  id: string;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  tripId: string;
  activities: Activity[];
}

interface Activity {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  type: 'TRANSPORT' | 'ACCOMMODATION' | 'ACTIVITY' | 'FOOD' | 'OTHER';
  cost?: number;
  transportType?: 'WALK' | 'TRANSIT' | 'CAR' | 'BIKE' | 'TAXI' | 'PLANE' | 'TRAIN' | 'BUS' | 'BOAT' | 'OTHER' | null;
  itineraryDayId: string;
  placeId?: string;
  place?: Place;
  locationId?: string;
  location?: Location;
}

interface Place {
  id: string;
  name: string;
  description?: string;
  type: string;
  address?: string;
  website?: string;
  phone?: string;
  openingHours?: string;
  priceRange?: string;
  rating?: number;
  imageUrl?: string;
  location?: Location;
}

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

interface CreateDayData {
  date: Date;
  note?: string;
}

interface UpdateDayData {
  note?: string;
}

interface CreateActivityData {
  title: string;
  startTime: Date;
  endTime: Date;
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
  transportType?: 'WALK' | 'TRANSIT' | 'CAR' | 'BIKE' | 'TAXI' | 'PLANE' | 'TRAIN' | 'BUS' | 'BOAT' | 'OTHER';
}

interface UpdateActivityData extends Partial<CreateActivityData> {}

export function useItinerary(tripId: string) {
  const { isAuthenticated } = useAuth();
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItinerary = useCallback(async () => {
    if (!isAuthenticated || !tripId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/trips/${tripId}/itinerary`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch itinerary');
      }
      
      const result = await response.json();
      setDays(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching itinerary:', err);
    } finally {
      setIsLoading(false);
    }
  }, [tripId, isAuthenticated]);

  const addDay = useCallback(
    async (data: CreateDayData) => {
      if (!isAuthenticated || !tripId) return null;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/trips/${tripId}/itinerary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add day');
        }
        
        const result = await response.json();
        
        // Add the new day to the days array
        setDays((prevDays) => [...prevDays, { ...result.data, activities: [] }]);
        
        return result.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error adding day:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [tripId, isAuthenticated]
  );

  const updateDay = useCallback(
    async (dayId: string, data: UpdateDayData) => {
      if (!isAuthenticated || !tripId || !dayId) return false;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/trips/${tripId}/itinerary?dayId=${dayId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update day');
        }
        
        const result = await response.json();
        
        // Update the day in the days array
        setDays((prevDays) =>
          prevDays.map((day) => (day.id === dayId ? { ...day, ...result.data } : day))
        );
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error updating day:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [tripId, isAuthenticated]
  );

  const deleteDay = useCallback(
    async (dayId: string) => {
      if (!isAuthenticated || !tripId || !dayId) return false;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/trips/${tripId}/itinerary?dayId=${dayId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete day');
        }
        
        // Remove the day from the days array
        setDays((prevDays) => prevDays.filter((day) => day.id !== dayId));
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error deleting day:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [tripId, isAuthenticated]
  );

  const addActivity = useCallback(
    async (dayId: string, data: CreateActivityData) => {
      if (!isAuthenticated || !tripId || !dayId) return null;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/trips/${tripId}/itinerary/${dayId}/activities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add activity');
        }
        
        const result = await response.json();
        
        // Add the new activity to the appropriate day
        setDays((prevDays) =>
          prevDays.map((day) => {
            if (day.id === dayId) {
              return {
                ...day,
                activities: [...day.activities, result.data],
              };
            }
            return day;
          })
        );
        
        return result.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error adding activity:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [tripId, isAuthenticated]
  );

  const updateActivity = useCallback(
    async (dayId: string, activityId: string, data: UpdateActivityData) => {
      if (!isAuthenticated || !tripId || !dayId || !activityId) return false;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/trips/${tripId}/itinerary/${dayId}/activities?activityId=${activityId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update activity');
        }
        
        const result = await response.json();
        
        // Update the activity in the appropriate day
        setDays((prevDays) =>
          prevDays.map((day) => {
            if (day.id === dayId) {
              return {
                ...day,
                activities: day.activities.map((activity) =>
                  activity.id === activityId ? result.data : activity
                ),
              };
            }
            return day;
          })
        );
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error updating activity:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [tripId, isAuthenticated]
  );

  const deleteActivity = useCallback(
    async (dayId: string, activityId: string) => {
      if (!isAuthenticated || !tripId || !dayId || !activityId) return false;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/trips/${tripId}/itinerary/${dayId}/activities?activityId=${activityId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete activity');
        }
        
        // Remove the activity from the appropriate day
        setDays((prevDays) =>
          prevDays.map((day) => {
            if (day.id === dayId) {
              return {
                ...day,
                activities: day.activities.filter((activity) => activity.id !== activityId),
              };
            }
            return day;
          })
        );
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error deleting activity:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [tripId, isAuthenticated]
  );

  return {
    days,
    isLoading,
    error,
    fetchItinerary,
    addDay,
    updateDay,
    deleteDay,
    addActivity,
    updateActivity,
    deleteActivity,
  };
} 