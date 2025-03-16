import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTrip } from "../contexts/TripContext";
import { useItinerary } from "../contexts/ItineraryContext";
import { Itinerary } from "../services/api";
import ItineraryEditorComponent from "../components/itinerary/ItineraryEditor";

const ItineraryEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId") || "";
  const { fetchTripById } = useTrip();
  const { fetchItineraryByTripId, currentItinerary } = useItinerary();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // If we have an itinerary ID, we're editing an existing itinerary
        if (id) {
          // The currentItinerary should be loaded by the ItineraryProvider
          if (currentItinerary && currentItinerary._id === id) {
            setItinerary(currentItinerary);
          } else {
            // If not, we need to fetch the trip first to get the tripId
            const trip = await fetchTripById(id);
            if (trip && trip.itinerary) {
              const fetchedItinerary = await fetchItineraryByTripId(trip._id);
              setItinerary(fetchedItinerary);
            }
          }
        }
        // If we have a tripId from query params, we're creating a new itinerary
        else if (tripId) {
          // Check if there's already an itinerary for this trip
          const existingItinerary = await fetchItineraryByTripId(tripId);
          if (existingItinerary) {
            setItinerary(existingItinerary);
          }

          // If not, we'll create a new one (handled by the ItineraryEditor component)
        } else {
          setError("No itinerary ID or trip ID provided");
        }
      } catch (err) {
        console.error("Failed to load itinerary data:", err);
        setError("Failed to load itinerary data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, tripId, fetchTripById, fetchItineraryByTripId, currentItinerary]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading itinerary data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {itinerary ? "Edit Itinerary" : "Create Itinerary"}
      </h1>
      <ItineraryEditorComponent
        tripId={tripId || (itinerary?.tripId as string)}
        initialItinerary={itinerary}
      />
    </div>
  );
};

export default ItineraryEditorPage;
