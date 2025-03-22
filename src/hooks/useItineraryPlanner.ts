import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
  generateItinerary,
  generateAlternativeItinerary,
  suggestReplacement,
} from '@/lib/ai-service';
import { ItineraryDay, Activity, ItineraryFormData } from '@/types/itinerary';

export function useItineraryPlanner() {
  const { isAuthenticated } = useAuth();
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrip, setCurrentTrip] = useState<{
    id: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
    interests: string[];
  } | null>(null);
  const [offlineItinerary, setOfflineItinerary] = useState<ItineraryDay[] | null>(null);

  // Load offline itinerary from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedItinerary = localStorage.getItem('offlineItinerary');
      if (storedItinerary) {
        try {
          setOfflineItinerary(JSON.parse(storedItinerary));
        } catch (err) {
          console.error('Error parsing stored itinerary:', err);
        }
      }
    }
  }, []);

  // Save itinerary to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && itinerary.length > 0) {
      localStorage.setItem('offlineItinerary', JSON.stringify(itinerary));
    }
  }, [itinerary]);

  // Generate a new itinerary using AI
  const createAiItinerary = useCallback(
    async (formData: ItineraryFormData): Promise<ItineraryDay[] | null> => {
      if (!isAuthenticated) return null;

      setIsLoading(true);
      setError(null);

      try {
        const generatedItinerary = await generateItinerary(formData);

        setItinerary(generatedItinerary);
        setCurrentTrip({
          id: generatedItinerary[0]?.tripId || 'temporary-trip-id',
          ...formData,
        });

        return generatedItinerary;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred generating the itinerary');
        console.error('Error generating itinerary:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Generate an alternative itinerary
  const createAlternativeItinerary = useCallback(async (): Promise<ItineraryDay[] | null> => {
    if (!isAuthenticated || !currentTrip) return null;

    setIsLoading(true);
    setError(null);

    try {
      const generatedItinerary = await generateAlternativeItinerary({
        tripId: currentTrip.id,
        destination: currentTrip.destination,
        startDate: currentTrip.startDate,
        endDate: currentTrip.endDate,
        budget: currentTrip.budget,
        interests: currentTrip.interests,
        currentItinerary: itinerary,
      });

      setItinerary(generatedItinerary);

      return generatedItinerary;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred generating the alternative itinerary'
      );
      console.error('Error generating alternative itinerary:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentTrip, itinerary]);

  // Reorder activities within a day (drag and drop functionality)
  const reorderActivities = useCallback(
    (dayId: string, sourceIndex: number, destinationIndex: number): boolean => {
      try {
        setItinerary((prevItinerary) => {
          const updatedItinerary = [...prevItinerary];
          const dayIndex = updatedItinerary.findIndex((day) => day.id === dayId);

          if (dayIndex === -1) return prevItinerary;

          const day = updatedItinerary[dayIndex];
          const updatedActivities = [...day.activities];
          const [movedActivity] = updatedActivities.splice(sourceIndex, 1);
          updatedActivities.splice(destinationIndex, 0, movedActivity);

          updatedItinerary[dayIndex] = {
            ...day,
            activities: updatedActivities,
          };

          return updatedItinerary;
        });

        return true;
      } catch (err) {
        console.error('Error reordering activities:', err);
        return false;
      }
    },
    []
  );

  // Remove an activity and get an AI-generated replacement suggestion
  const removeAndReplaceActivity = useCallback(
    async (dayId: string, activityId: string): Promise<Activity | null> => {
      if (!isAuthenticated || !currentTrip) return null;

      setIsLoading(true);
      setError(null);

      try {
        // Find the day and remove the activity
        const dayIndex = itinerary.findIndex((day) => day.id === dayId);
        if (dayIndex === -1) throw new Error('Day not found');

        const day = itinerary[dayIndex];
        const activityIndex = day.activities.findIndex((a) => a.id === activityId);
        if (activityIndex === -1) throw new Error('Activity not found');

        // Create a copy of itinerary with activity removed
        const updatedItinerary = [...itinerary];
        const updatedActivities = [...day.activities];
        const removedActivity = updatedActivities.splice(activityIndex, 1)[0];
        updatedItinerary[dayIndex] = {
          ...day,
          activities: updatedActivities,
        };

        setItinerary(updatedItinerary);

        // Get a list of place IDs to exclude (to avoid suggesting the same place)
        const excludedPlaceIds = day.activities
          .map((a) => a.placeId)
          .filter((id): id is string => id !== undefined);

        if (removedActivity.placeId) {
          excludedPlaceIds.push(removedActivity.placeId);
        }

        // Get AI suggestion for replacement
        const replacementActivity = await suggestReplacement({
          tripId: currentTrip.id,
          dayId,
          date: day.date,
          destination: currentTrip.destination,
          interests: currentTrip.interests,
          budget: currentTrip.budget,
          excludedPlaceIds,
        });

        // Add the new activity to the itinerary
        const newUpdatedItinerary = [...updatedItinerary];
        const newUpdatedActivities = [...newUpdatedItinerary[dayIndex].activities];
        newUpdatedActivities.push(replacementActivity);
        newUpdatedItinerary[dayIndex] = {
          ...newUpdatedItinerary[dayIndex],
          activities: newUpdatedActivities,
        };

        setItinerary(newUpdatedItinerary);

        return replacementActivity;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred removing the activity');
        console.error('Error removing and replacing activity:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, currentTrip, itinerary]
  );

  // Move activity from one day to another
  const moveActivityBetweenDays = useCallback(
    (sourceDayId: string, destinationDayId: string, activityId: string): boolean => {
      try {
        setItinerary((prevItinerary) => {
          const updatedItinerary = [...prevItinerary];

          // Find source day
          const sourceDayIndex = updatedItinerary.findIndex((day) => day.id === sourceDayId);
          if (sourceDayIndex === -1) return prevItinerary;

          // Find destination day
          const destinationDayIndex = updatedItinerary.findIndex(
            (day) => day.id === destinationDayId
          );
          if (destinationDayIndex === -1) return prevItinerary;

          // Find activity in source day
          const sourceDay = updatedItinerary[sourceDayIndex];
          const activityIndex = sourceDay.activities.findIndex(
            (activity) => activity.id === activityId
          );
          if (activityIndex === -1) return prevItinerary;

          // Remove activity from source day
          const updatedSourceActivities = [...sourceDay.activities];
          const [movedActivity] = updatedSourceActivities.splice(activityIndex, 1);

          // Add activity to destination day
          const destinationDay = updatedItinerary[destinationDayIndex];
          const updatedDestinationActivities = [...destinationDay.activities];

          // Update the itineraryDayId of the moved activity
          const updatedActivity = {
            ...movedActivity,
            itineraryDayId: destinationDayId,
          };

          updatedDestinationActivities.push(updatedActivity);

          // Update the itinerary
          updatedItinerary[sourceDayIndex] = {
            ...sourceDay,
            activities: updatedSourceActivities,
          };

          updatedItinerary[destinationDayIndex] = {
            ...destinationDay,
            activities: updatedDestinationActivities,
          };

          return updatedItinerary;
        });

        return true;
      } catch (err) {
        console.error('Error moving activity between days:', err);
        return false;
      }
    },
    []
  );

  // Load an itinerary from the offline storage
  const loadOfflineItinerary = useCallback(() => {
    if (offlineItinerary) {
      setItinerary(offlineItinerary);
      return true;
    }
    return false;
  }, [offlineItinerary]);

  // Sync offline itinerary with the server
  const syncOfflineItinerary = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !offlineItinerary || !currentTrip) return false;

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would make API calls to sync the offline itinerary
      // For now, we just set the itinerary from the offline storage
      setItinerary(offlineItinerary);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred syncing the itinerary');
      console.error('Error syncing offline itinerary:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, offlineItinerary, currentTrip]);

  return {
    itinerary,
    isLoading,
    error,
    createAiItinerary,
    createAlternativeItinerary,
    reorderActivities,
    removeAndReplaceActivity,
    moveActivityBetweenDays,
    loadOfflineItinerary,
    syncOfflineItinerary,
    currentTrip,
  };
}
