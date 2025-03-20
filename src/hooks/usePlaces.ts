import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface Place {
  id: string;
  name: string;
  description?: string;
  type: 'ATTRACTION' | 'RESTAURANT' | 'HOTEL' | 'CAFE' | 'BAR' | 'MUSEUM' | 'PARK' | 'BEACH' | 'SHOP' | 'TRANSPORT' | 'OTHER';
  address?: string;
  website?: string;
  phone?: string;
  openingHours?: string;
  priceRange?: 'FREE' | 'INEXPENSIVE' | 'MODERATE' | 'EXPENSIVE' | 'VERY_EXPENSIVE';
  rating?: number;
  imageUrl?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  location?: {
    id: string;
    latitude: number;
    longitude: number;
    address?: string;
    name?: string;
  };
  reviews?: {
    id: string;
    rating: number;
    comment?: string;
    userId: string;
    user: {
      id: string;
      name?: string;
      image?: string;
    };
    createdAt: Date;
  }[];
}

interface CreatePlaceData {
  name: string;
  description?: string;
  type: 'ATTRACTION' | 'RESTAURANT' | 'HOTEL' | 'CAFE' | 'BAR' | 'MUSEUM' | 'PARK' | 'BEACH' | 'SHOP' | 'TRANSPORT' | 'OTHER';
  address?: string;
  website?: string;
  phone?: string;
  openingHours?: string;
  priceRange?: 'FREE' | 'INEXPENSIVE' | 'MODERATE' | 'EXPENSIVE' | 'VERY_EXPENSIVE';
  rating?: number;
  imageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    name?: string;
  };
}

interface UpdatePlaceData extends Partial<CreatePlaceData> {}

interface PlaceFilters {
  query?: string;
  type?: 'ATTRACTION' | 'RESTAURANT' | 'HOTEL' | 'CAFE' | 'BAR' | 'MUSEUM' | 'PARK' | 'BEACH' | 'SHOP' | 'TRANSPORT' | 'OTHER';
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export function usePlaces() {
  const { isAuthenticated } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    pageCount: 0,
    total: 0,
  });

  const searchPlaces = useCallback(
    async (filters: PlaceFilters = {}) => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        
        if (filters.query) {
          queryParams.append('query', filters.query);
        }
        
        if (filters.type) {
          queryParams.append('type', filters.type);
        }
        
        if (filters.latitude) {
          queryParams.append('latitude', filters.latitude.toString());
        }
        
        if (filters.longitude) {
          queryParams.append('longitude', filters.longitude.toString());
        }
        
        if (filters.radius) {
          queryParams.append('radius', filters.radius.toString());
        }
        
        queryParams.append('page', String(filters.page || 1));
        queryParams.append('limit', String(filters.limit || 20));

        const response = await fetch(`/api/places?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to search places');
        }
        
        const result: PaginatedResponse<Place> = await response.json();
        setPlaces(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error searching places:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const getPlace = useCallback(
    async (id: string) => {
      if (!isAuthenticated || !id) return;

      setIsLoading(true);
      setError(null);
      setPlace(null);

      try {
        const response = await fetch(`/api/places/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch place');
        }
        
        const result = await response.json();
        setPlace(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching place:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const createPlace = useCallback(
    async (data: CreatePlaceData) => {
      if (!isAuthenticated) return null;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/places', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create place');
        }
        
        const result = await response.json();
        return result.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error creating place:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const updatePlace = useCallback(
    async (id: string, data: UpdatePlaceData) => {
      if (!isAuthenticated || !id) return false;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/places/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update place');
        }
        
        const result = await response.json();
        
        // Update the current place if it's loaded
        if (place?.id === id) {
          setPlace(result.data);
        }
        
        // Update the place in the places array
        setPlaces((prevPlaces) =>
          prevPlaces.map((p) => (p.id === id ? result.data : p))
        );
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error updating place:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, place]
  );

  const deletePlace = useCallback(
    async (id: string) => {
      if (!isAuthenticated || !id) return false;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/places/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete place');
        }
        
        // Remove place from places array
        setPlaces((prevPlaces) => prevPlaces.filter((p) => p.id !== id));
        
        // Clear the current place if it's the one being deleted
        if (place?.id === id) {
          setPlace(null);
        }
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error deleting place:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, place]
  );

  return {
    places,
    place,
    isLoading,
    error,
    pagination,
    searchPlaces,
    getPlace,
    createPlace,
    updatePlace,
    deletePlace,
  };
} 