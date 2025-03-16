import { useState } from "react";
import { Day, Activity } from "../../services/api";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Clock, MapPin, DollarSign } from "lucide-react";

interface DayPlannerProps {
  day: Day;
  dayIndex: number;
  onUpdateDay: (dayIndex: number, updatedDay: Day) => void;
}

const DayPlanner = ({ day, dayIndex, onUpdateDay }: DayPlannerProps) => {
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [editingActivityIndex, setEditingActivityIndex] = useState<
    number | null
  >(null);
  const [activityForm, setActivityForm] = useState<Activity>({
    name: "",
    type: "sightseeing",
    location: "",
    description: "",
    cost: 0,
    duration: 60,
    startTime: "09:00",
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddActivity = () => {
    setActivityForm({
      name: "",
      type: "sightseeing",
      location: "",
      description: "",
      cost: 0,
      duration: 60,
      startTime: "09:00",
    });
    setIsAddingActivity(true);
    setEditingActivityIndex(null);
  };

  const handleEditActivity = (index: number) => {
    setActivityForm({ ...day.activities[index] });
    setIsAddingActivity(true);
    setEditingActivityIndex(index);
  };

  const handleDeleteActivity = (index: number) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      const updatedActivities = [...day.activities];
      updatedActivities.splice(index, 1);
      onUpdateDay(dayIndex, { ...day, activities: updatedActivities });
      toast.success("Activity deleted successfully");
    }
  };

  const handleActivityFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setActivityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setActivityForm((prev) => ({
      ...prev,
      [name]: name === "cost" ? parseFloat(value) || 0 : parseInt(value) || 0,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setActivityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveActivity = () => {
    if (!activityForm.name || !activityForm.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedActivities = [...day.activities];

    if (editingActivityIndex !== null) {
      updatedActivities[editingActivityIndex] = activityForm;
    } else {
      updatedActivities.push(activityForm);
    }

    // Sort activities by start time
    updatedActivities.sort((a, b) => {
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return a.startTime.localeCompare(b.startTime);
    });

    onUpdateDay(dayIndex, { ...day, activities: updatedActivities });
    setIsAddingActivity(false);
    toast.success(
      editingActivityIndex !== null
        ? "Activity updated successfully"
        : "Activity added successfully"
    );
  };

  const activityTypes = [
    { value: "sightseeing", label: "Sightseeing" },
    { value: "museum", label: "Museum" },
    { value: "restaurant", label: "Restaurant" },
    { value: "shopping", label: "Shopping" },
    { value: "outdoor", label: "Outdoor" },
    { value: "entertainment", label: "Entertainment" },
    { value: "relaxation", label: "Relaxation" },
    { value: "transportation", label: "Transportation" },
    { value: "other", label: "Other" },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          Day {dayIndex + 1}: {formatDate(day.date)}
        </CardTitle>
        <CardDescription>Plan your activities for this day</CardDescription>
      </CardHeader>
      <CardContent>
        {day.activities.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-md">
            <p className="text-gray-500 mb-4">
              No activities planned for this day
            </p>
            <Button onClick={handleAddActivity}>
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {day.activities.map((activity, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{activity.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{activity.location}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditActivity(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteActivity(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {activity.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {activity.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-3">
                      {activity.startTime && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{activity.startTime}</span>
                        </div>
                      )}
                      {activity.duration && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{activity.duration} min</span>
                        </div>
                      )}
                      {activity.cost > 0 && (
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>${activity.cost.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <div className="text-center mt-6">
              <Button onClick={handleAddActivity}>
                <Plus className="mr-2 h-4 w-4" />
                Add Another Activity
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingActivityIndex !== null ? "Edit Activity" : "Add Activity"}
            </DialogTitle>
            <DialogDescription>
              {editingActivityIndex !== null
                ? "Update the details of this activity"
                : "Add a new activity to your itinerary"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Activity Name *</Label>
              <Input
                id="name"
                name="name"
                value={activityForm.name}
                onChange={handleActivityFormChange}
                placeholder="e.g., Visit Eiffel Tower"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Activity Type</Label>
              <Select
                value={activityForm.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={activityForm.location}
                onChange={handleActivityFormChange}
                placeholder="e.g., Champ de Mars, 5 Avenue Anatole France"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={activityForm.startTime}
                  onChange={handleActivityFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="0"
                  value={activityForm.duration}
                  onChange={handleNumberChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                min="0"
                step="0.01"
                value={activityForm.cost}
                onChange={handleNumberChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={activityForm.description}
                onChange={handleActivityFormChange}
                placeholder="Add notes or details about this activity"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingActivity(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveActivity}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DayPlanner;
