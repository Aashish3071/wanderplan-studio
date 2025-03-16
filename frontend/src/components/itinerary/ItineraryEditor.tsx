import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Itinerary, Day } from "../../services/api";
import { useItinerary } from "../../contexts/ItineraryContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Plus, ArrowLeft, Loader2 } from "lucide-react";
import DayPlanner from "./DayPlanner";

interface ItineraryEditorProps {
  tripId: string;
  initialItinerary?: Itinerary | null;
  onSave?: (itinerary: Itinerary) => void;
}

const ItineraryEditor = ({
  tripId,
  initialItinerary,
  onSave,
}: ItineraryEditorProps) => {
  const navigate = useNavigate();
  const { createItinerary, updateItinerary, isLoading } = useItinerary();
  const [itinerary, setItinerary] = useState<Partial<Itinerary>>({
    tripId,
    destination: "",
    startDate: "",
    endDate: "",
    days: [],
    budgetBreakdown: {
      accommodation: 0,
      food: 0,
      activities: 0,
      transportation: 0,
      miscellaneous: 0,
    },
    totalCost: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialItinerary) {
      setItinerary(initialItinerary);
    }
  }, [initialItinerary]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setItinerary((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateDay = (dayIndex: number, updatedDay: Day) => {
    const updatedDays = [...(itinerary.days || [])];
    updatedDays[dayIndex] = updatedDay;

    // Recalculate total cost
    let activitiesCost = 0;
    updatedDays.forEach((day) => {
      day.activities.forEach((activity) => {
        activitiesCost += activity.cost || 0;
      });
    });

    const budgetBreakdown = {
      ...(itinerary.budgetBreakdown || {
        accommodation: 0,
        food: 0,
        activities: 0,
        transportation: 0,
        miscellaneous: 0,
      }),
      activities: activitiesCost,
    };

    const totalCost =
      budgetBreakdown.accommodation +
      budgetBreakdown.food +
      budgetBreakdown.activities +
      budgetBreakdown.transportation +
      budgetBreakdown.miscellaneous;

    setItinerary((prev) => ({
      ...prev,
      days: updatedDays,
      budgetBreakdown,
      totalCost,
    }));
  };

  const handleAddDay = () => {
    const days = [...(itinerary.days || [])];
    const lastDay = days[days.length - 1];

    // Calculate the next day's date
    let nextDate;
    if (lastDay) {
      const lastDate = new Date(lastDay.date);
      nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + 1);
    } else if (itinerary.startDate) {
      nextDate = new Date(itinerary.startDate);
    } else {
      nextDate = new Date();
    }

    const newDay: Day = {
      date: nextDate.toISOString().split("T")[0],
      activities: [],
      meals: {},
    };

    days.push(newDay);
    setItinerary((prev) => ({ ...prev, days }));
  };

  const handleSave = async () => {
    if (!itinerary.destination || !itinerary.startDate || !itinerary.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!itinerary.days || itinerary.days.length === 0) {
      toast.error("Please add at least one day to your itinerary");
      return;
    }

    setIsSaving(true);

    try {
      let savedItinerary;

      if (initialItinerary && initialItinerary._id) {
        // Update existing itinerary
        savedItinerary = await updateItinerary(initialItinerary._id, itinerary);
        toast.success("Itinerary updated successfully");
      } else {
        // Create new itinerary
        savedItinerary = await createItinerary(tripId, itinerary);
        toast.success("Itinerary created successfully");
      }

      if (onSave && savedItinerary) {
        onSave(savedItinerary);
      }

      // Navigate to itinerary detail page
      navigate(`/itinerary/${savedItinerary._id}`);
    } catch (err) {
      console.error("Failed to save itinerary:", err);
      toast.error("Failed to save itinerary. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !initialItinerary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate(`/trip/${tripId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trip
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Itinerary
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Itinerary Details</CardTitle>
          <CardDescription>
            Basic information about your itinerary
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              name="destination"
              value={itinerary.destination || ""}
              onChange={handleInputChange}
              placeholder="e.g., Paris, France"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={itinerary.startDate?.split("T")[0] || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={itinerary.endDate?.split("T")[0] || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Daily Itinerary</h2>
          <Button onClick={handleAddDay}>
            <Plus className="mr-2 h-4 w-4" />
            Add Day
          </Button>
        </div>

        {itinerary.days && itinerary.days.length > 0 ? (
          itinerary.days.map((day, index) => (
            <DayPlanner
              key={index}
              day={day}
              dayIndex={index}
              onUpdateDay={handleUpdateDay}
            />
          ))
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">
                No days added to your itinerary yet
              </p>
              <Button onClick={handleAddDay}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Day
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Itinerary
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ItineraryEditor;
