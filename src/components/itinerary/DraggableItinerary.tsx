import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { Clock, MapPin, DollarSign, ArrowRight, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ItineraryDay, Activity } from '@/types/itinerary';
import GoogleMap from '@/components/maps/GoogleMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DraggableItineraryProps {
  itinerary: ItineraryDay[];
  onReorderActivities: (dayId: string, sourceIndex: number, destinationIndex: number) => void;
  onMoveActivityBetweenDays: (
    sourceDayId: string,
    destinationDayId: string,
    activityId: string
  ) => void;
  onRemoveActivity: (dayId: string, activityId: string) => void;
}

const DraggableItinerary: React.FC<DraggableItineraryProps> = ({
  itinerary,
  onReorderActivities,
  onMoveActivityBetweenDays,
  onRemoveActivity,
}) => {
  const [expandedActivities, setExpandedActivities] = useState<string[]>([]);

  const toggleActivityExpand = (activityId: string) => {
    setExpandedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId]
    );
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a droppable
    if (!destination) return;

    // Same position
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    // Moving within the same day
    if (source.droppableId === destination.droppableId) {
      onReorderActivities(source.droppableId, source.index, destination.index);
      return;
    }

    // Moving between days
    onMoveActivityBetweenDays(source.droppableId, destination.droppableId, draggableId);
  };

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), 'h:mm a');
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-8">
        {itinerary.map((day) => (
          <Card key={day.id} className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle>{format(new Date(day.date), 'EEEE, MMMM d, yyyy')}</CardTitle>
              {day.notes && <p className="text-sm text-muted-foreground">{day.notes}</p>}
            </CardHeader>
            <Droppable droppableId={day.id}>
              {(provided: DroppableProvided) => (
                <CardContent {...provided.droppableProps} ref={provided.innerRef} className="p-0">
                  <ul className="divide-y">
                    {day.activities.map((activity, index) => (
                      <Draggable key={activity.id} draggableId={activity.id} index={index}>
                        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`relative transition-colors ${
                              snapshot.isDragging ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className="p-4">
                              <div className="flex justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold">{activity.title}</h3>
                                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>
                                        {formatTime(activity.startTime)} -{' '}
                                        {formatTime(activity.endTime)}
                                      </span>
                                    </div>
                                    {activity.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span>
                                          {activity.location.address || activity.location.name}
                                        </span>
                                      </div>
                                    )}
                                    {activity.cost && (
                                      <div className="flex items-center gap-1">
                                        <DollarSign className="h-3.5 w-3.5" />
                                        <span>${activity.cost}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-4 flex items-start gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleActivityExpand(activity.id)}
                                    className="h-8 w-8"
                                  >
                                    <ArrowRight
                                      className={`h-4 w-4 transition-transform ${
                                        expandedActivities.includes(activity.id) ? 'rotate-90' : ''
                                      }`}
                                    />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onRemoveActivity(day.id, activity.id)}
                                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {expandedActivities.includes(activity.id) && (
                                <div className="mt-4 space-y-4">
                                  {activity.description && (
                                    <p className="text-sm">{activity.description}</p>
                                  )}

                                  {activity.imageUrl && (
                                    <div className="overflow-hidden rounded-md">
                                      <img
                                        src={activity.imageUrl}
                                        alt={activity.title}
                                        className="h-48 w-full object-cover"
                                      />
                                    </div>
                                  )}

                                  {activity.location && (
                                    <div className="h-48 overflow-hidden rounded-md">
                                      <GoogleMap
                                        location={activity.location}
                                        height="100%"
                                        showCurrentLocation
                                      />
                                    </div>
                                  )}

                                  {activity.place?.rating && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-sm font-medium">Rating:</span>
                                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800">
                                        {activity.place.rating.toFixed(1)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                </CardContent>
              )}
            </Droppable>
          </Card>
        ))}
      </div>
    </DragDropContext>
  );
};

export default DraggableItinerary;
