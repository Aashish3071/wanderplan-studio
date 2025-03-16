import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import { itineraryApi, Itinerary, Day, Activity } from "../services/api";
import { useAuth } from "./AuthContext";

interface ItineraryContextType {
  itineraries: Itinerary[];
  currentItinerary: Itinerary | null;
  isLoading: boolean;
  error: string | null;
  fetchItineraries: () => Promise<Itinerary[]>;
  fetchItineraryById: (id: string) => Promise<Itinerary | null>;
  fetchItineraryByTripId: (tripId: string) => Promise<Itinerary | null>;
  createItinerary: (itinerary: Partial<Itinerary>) => Promise<Itinerary | null>;
  updateItinerary: (
    id: string,
    itinerary: Partial<Itinerary>
  ) => Promise<Itinerary | null>;
  deleteItinerary: (id: string) => Promise<boolean>;
  addDay: (itineraryId: string, day: Partial<Day>) => Promise<Itinerary | null>;
  updateDay: (
    itineraryId: string,
    dayId: string,
    day: Partial<Day>
  ) => Promise<Itinerary | null>;
  deleteDay: (itineraryId: string, dayId: string) => Promise<Itinerary | null>;
  addActivity: (
    itineraryId: string,
    dayId: string,
    activity: Partial<Activity>
  ) => Promise<Itinerary | null>;
  updateActivity: (
    itineraryId: string,
    dayId: string,
    activityId: string,
    activity: Partial<Activity>
  ) => Promise<Itinerary | null>;
  deleteActivity: (
    itineraryId: string,
    dayId: string,
    activityId: string
  ) => Promise<Itinerary | null>;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(
  undefined
);

interface ItineraryProviderProps {
  children: ReactNode;
}

export const ItineraryProvider: React.FC<ItineraryProviderProps> = ({
  children,
}) => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth context safely
  const auth = useContext(
    React.createContext<{ token?: string }>({ token: undefined })
  );
  const authContext = useAuth();
  const token = authContext?.token || auth?.token;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchItineraries = async (): Promise<Itinerary[]> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return [];
    }

    try {
      const response = await fetch(`${API_URL}/itineraries`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch itineraries");
      }

      const data = await response.json();
      setItineraries(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching itineraries:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItineraryById = async (id: string): Promise<Itinerary | null> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/itineraries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch itinerary");
      }

      const data = await response.json();
      setCurrentItinerary(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching itinerary:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItineraryByTripId = async (
    tripId: string
  ): Promise<Itinerary | null> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/itineraries/trip/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No itinerary found for this trip, which is a valid state
          return null;
        }
        throw new Error("Failed to fetch itinerary");
      }

      const data = await response.json();
      setCurrentItinerary(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching itinerary by trip ID:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createItinerary = async (
    itinerary: Partial<Itinerary>
  ): Promise<Itinerary | null> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/itineraries`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itinerary),
      });

      if (!response.ok) {
        throw new Error("Failed to create itinerary");
      }

      const data = await response.json();
      setItineraries([...itineraries, data]);
      setCurrentItinerary(data);
      toast.success("Itinerary created successfully");
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error creating itinerary:", err);
      toast.error("Failed to create itinerary");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItinerary = async (
    id: string,
    itinerary: Partial<Itinerary>
  ): Promise<Itinerary | null> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/itineraries/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itinerary),
      });

      if (!response.ok) {
        throw new Error("Failed to update itinerary");
      }

      const data = await response.json();
      setItineraries(itineraries.map((i) => (i._id === id ? data : i)));
      setCurrentItinerary(data);
      toast.success("Itinerary updated successfully");
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error updating itinerary:", err);
      toast.error("Failed to update itinerary");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItinerary = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/itineraries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete itinerary");
      }

      setItineraries(itineraries.filter((i) => i._id !== id));
      if (currentItinerary?._id === id) {
        setCurrentItinerary(null);
      }
      toast.success("Itinerary deleted successfully");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error deleting itinerary:", err);
      toast.error("Failed to delete itinerary");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addDay = async (
    itineraryId: string,
    day: Partial<Day>
  ): Promise<Itinerary | null> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/itineraries/${itineraryId}/days`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(day),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add day");
      }

      const data = await response.json();
      setItineraries(
        itineraries.map((i) => (i._id === itineraryId ? data : i))
      );
      setCurrentItinerary(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error adding day:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDay = async (
    itineraryId: string,
    dayId: string,
    day: Partial<Day>
  ): Promise<Itinerary | null> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/itineraries/${itineraryId}/days/${dayId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(day),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update day");
      }

      const data = await response.json();
      setItineraries(
        itineraries.map((i) => (i._id === itineraryId ? data : i))
      );
      setCurrentItinerary(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error updating day:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDay = async (
    itineraryId: string,
    dayId: string
  ): Promise<Itinerary | null> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/itineraries/${itineraryId}/days/${dayId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete day");
      }

      const data = await response.json();
      setItineraries(
        itineraries.map((i) => (i._id === itineraryId ? data : i))
      );
      setCurrentItinerary(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error deleting day:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addActivity = async (
    itineraryId: string,
    dayId: string,
    activity: Partial<Activity>
  ): Promise<Itinerary | null> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/itineraries/${itineraryId}/days/${dayId}/activities`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(activity),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add activity");
      }

      const data = await response.json();
      setItineraries(
        itineraries.map((i) => (i._id === itineraryId ? data : i))
      );
      setCurrentItinerary(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error adding activity:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateActivity = async (
    itineraryId: string,
    dayId: string,
    activityId: string,
    activity: Partial<Activity>
  ): Promise<Itinerary | null> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/itineraries/${itineraryId}/days/${dayId}/activities/${activityId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(activity),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update activity");
      }

      const data = await response.json();
      setItineraries(
        itineraries.map((i) => (i._id === itineraryId ? data : i))
      );
      setCurrentItinerary(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error updating activity:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteActivity = async (
    itineraryId: string,
    dayId: string,
    activityId: string
  ): Promise<Itinerary | null> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/itineraries/${itineraryId}/days/${dayId}/activities/${activityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete activity");
      }

      const data = await response.json();
      setItineraries(
        itineraries.map((i) => (i._id === itineraryId ? data : i))
      );
      setCurrentItinerary(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error deleting activity:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    itineraries,
    currentItinerary,
    isLoading,
    error,
    fetchItineraries,
    fetchItineraryById,
    fetchItineraryByTripId,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    addDay,
    updateDay,
    deleteDay,
    addActivity,
    updateActivity,
    deleteActivity,
  };

  return (
    <ItineraryContext.Provider value={value}>
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItinerary = (): ItineraryContextType => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error("useItinerary must be used within an ItineraryProvider");
  }
  return context;
};
