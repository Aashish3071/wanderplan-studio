import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../../contexts/TripContext";
import { Trip, TripStatus } from "../../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  MapPinIcon,
  DollarSignIcon,
  PlusIcon,
} from "lucide-react";

const TripList = () => {
  const { trips, isLoading, error, fetchTrips } = useTrip();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case TripStatus.PLANNING:
        return "bg-yellow-100 text-yellow-800";
      case TripStatus.CONFIRMED:
        return "bg-green-100 text-green-800";
      case TripStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      case TripStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateTrip = () => {
    navigate("/plan-trip");
  };

  const handleViewTrip = (tripId: string) => {
    navigate(`/trip/${tripId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
        <p>{error}</p>
        <Button variant="outline" className="mt-2" onClick={() => fetchTrips()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Trips</h2>
        <Button onClick={handleCreateTrip}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Trip
        </Button>
      </div>

      {trips.length === 0 ? (
        <Card className="bg-gray-50 border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">You don't have any trips yet.</p>
            <Button onClick={handleCreateTrip}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Your First Trip
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card
              key={trip._id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{trip.title}</CardTitle>
                  <Badge className={getStatusColor(trip.status as TripStatus)}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {trip.destination}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSignIcon className="h-4 w-4 mr-1" />
                    Budget: ${trip.budget.toLocaleString()}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleViewTrip(trip._id)}
                  >
                    View Trip
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() =>
                      trip.itinerary
                        ? navigate(`/itinerary/edit/${trip.itinerary}`)
                        : navigate(`/itinerary/create?tripId=${trip._id}`)
                    }
                  >
                    {trip.itinerary ? "Edit Itinerary" : "Plan Itinerary"}
                  </Button>
                  {trip.itinerary && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/itinerary/${trip.itinerary}`)}
                    >
                      View Itinerary
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripList;
