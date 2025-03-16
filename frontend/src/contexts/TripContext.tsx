import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { tripApi, Trip } from "../services/api";
import { useAuth } from "./AuthContext";

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  isLoading: boolean;
  error: string | null;
  fetchTrips: () => Promise<void>;
  fetchTripById: (id: string) => Promise<Trip>;
  createTrip: (
    tripData: Omit<Trip, "_id" | "userId" | "createdAt" | "updatedAt">
  ) => Promise<Trip>;
  updateTrip: (id: string, tripData: Partial<Trip>) => Promise<Trip>;
  deleteTrip: (id: string) => Promise<void>;
  setCurrentTrip: (trip: Trip | null) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth context safely
  const auth = useContext(
    React.createContext<{ isAuthenticated?: boolean }>({
      isAuthenticated: false,
    })
  );
  let isAuthenticated = false;

  try {
    const authContext = useAuth();
    isAuthenticated =
      authContext?.isAuthenticated || auth?.isAuthenticated || false;
  } catch (error) {
    console.error("Auth context not available:", error);
    isAuthenticated = false;
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
    } else {
      setTrips([]);
      setCurrentTrip(null);
    }
  }, [isAuthenticated]);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tripApi.getAll();
      setTrips(response.data.data);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
      setError("Failed to fetch trips. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTripById = async (id: string): Promise<Trip> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tripApi.getById(id);
      const trip = response.data.data;
      setCurrentTrip(trip);
      return trip;
    } catch (err) {
      console.error(`Failed to fetch trip with ID ${id}:`, err);
      setError("Failed to fetch trip details. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createTrip = async (
    tripData: Omit<Trip, "_id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<Trip> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tripApi.create(tripData);
      const newTrip = response.data.data;
      setTrips((prevTrips) => [...prevTrips, newTrip]);
      return newTrip;
    } catch (err) {
      console.error("Failed to create trip:", err);
      setError("Failed to create trip. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrip = async (
    id: string,
    tripData: Partial<Trip>
  ): Promise<Trip> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tripApi.update(id, tripData);
      const updatedTrip = response.data.data;
      setTrips((prevTrips) =>
        prevTrips.map((trip) => (trip._id === id ? updatedTrip : trip))
      );
      if (currentTrip && currentTrip._id === id) {
        setCurrentTrip(updatedTrip);
      }
      return updatedTrip;
    } catch (err) {
      console.error(`Failed to update trip with ID ${id}:`, err);
      setError("Failed to update trip. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await tripApi.delete(id);
      setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== id));
      if (currentTrip && currentTrip._id === id) {
        setCurrentTrip(null);
      }
    } catch (err) {
      console.error(`Failed to delete trip with ID ${id}:`, err);
      setError("Failed to delete trip. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        isLoading,
        error,
        fetchTrips,
        fetchTripById,
        createTrip,
        updateTrip,
        deleteTrip,
        setCurrentTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextType => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
};
