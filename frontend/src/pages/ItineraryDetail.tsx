import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useItinerary } from "../contexts/ItineraryContext";
import { useTrip } from "../contexts/TripContext";
import { Itinerary, ActivityType } from "../services/api";
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
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Edit,
  ArrowLeft,
  Download,
  Share,
} from "lucide-react";

const ItineraryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchItineraryById, isLoading, error } = useItinerary();
  const { fetchTripById } = useTrip();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [tripTitle, setTripTitle] = useState<string>("");

  useEffect(() => {
    const loadItinerary = async () => {
      if (id) {
        try {
          const data = await fetchItineraryById(id);
          if (data) {
            setItinerary(data);
            // Fetch trip to get the title
            const trip = await fetchTripById(data.tripId);
            if (trip) {
              setTripTitle(trip.title);
            }
          }
        } catch (err) {
          console.error("Failed to load itinerary:", err);
        }
      }
    };

    loadItinerary();
  }, [id, fetchItineraryById, fetchTripById]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityTypeColor = (type: ActivityType) => {
    switch (type) {
      case ActivityType.SIGHTSEEING:
        return "bg-blue-100 text-blue-800";
      case ActivityType.DINING:
        return "bg-green-100 text-green-800";
      case ActivityType.SHOPPING:
        return "bg-purple-100 text-purple-800";
      case ActivityType.ENTERTAINMENT:
        return "bg-pink-100 text-pink-800";
      case ActivityType.TRANSPORTATION:
        return "bg-yellow-100 text-yellow-800";
      case ActivityType.ACCOMMODATION:
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Itinerary</h2>
          <p className="mb-6">
            Unable to load itinerary details. The itinerary may not exist or
            there was a server error.
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => navigate(`/trip/${itinerary.tripId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trip
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{tripTitle} Itinerary</h1>
          <div className="flex items-center text-gray-500 mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{itinerary.destination}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/itinerary/edit/${itinerary._id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Itinerary
          </Button>
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <span>
                {formatDate(itinerary.startDate)} -{" "}
                {formatDate(itinerary.endDate)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span>
                {Math.ceil(
                  (new Date(itinerary.endDate).getTime() -
                    new Date(itinerary.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-primary" />
              <span>
                {itinerary.budgetBreakdown
                  ? `$${Object.values(itinerary.budgetBreakdown).reduce(
                      (sum, value) => sum + value,
                      0
                    )}`
                  : "Not specified"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Daily Schedule</h2>

        {itinerary.days.length === 0 ? (
          <Card className="bg-gray-50 border border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">No days planned yet.</p>
              <Button
                onClick={() => navigate(`/itinerary/edit/${itinerary._id}`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Start Planning
              </Button>
            </CardContent>
          </Card>
        ) : (
          itinerary.days.map((day, dayIndex) => (
            <Card key={day._id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>
                  Day {dayIndex + 1}: {day.title || formatDate(day.date)}
                </CardTitle>
                <CardDescription>
                  {day.description || formatDate(day.date)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {day.activities.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No activities planned for this day.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {day.activities
                      .sort(
                        (a, b) =>
                          new Date(a.startTime).getTime() -
                          new Date(b.startTime).getTime()
                      )
                      .map((activity, actIndex) => (
                        <div key={activity._id}>
                          {actIndex > 0 && <Separator className="my-4" />}
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-20 text-sm text-gray-500">
                              {formatTime(activity.startTime)}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{activity.name}</h3>
                                <Badge
                                  className={getActivityTypeColor(
                                    activity.type
                                  )}
                                >
                                  {activity.type}
                                </Badge>
                              </div>
                              {activity.description && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {activity.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                {activity.location && (
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span>{activity.location}</span>
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{activity.duration} minutes</span>
                                </div>
                                {activity.cost !== undefined && (
                                  <div className="flex items-center">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    <span>${activity.cost}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {itinerary.notes && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{itinerary.notes}</p>
          </CardContent>
        </Card>
      )}

      {itinerary.budgetBreakdown && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Budget Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(itinerary.budgetBreakdown).map(
                ([category, amount]) => (
                  <div
                    key={category}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                  >
                    <span className="capitalize">{category}</span>
                    <span className="font-medium">${amount}</span>
                  </div>
                )
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-center w-full">
              <span className="font-bold">Total</span>
              <span className="font-bold">
                $
                {Object.values(itinerary.budgetBreakdown).reduce(
                  (sum, value) => sum + value,
                  0
                )}
              </span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ItineraryDetail;
