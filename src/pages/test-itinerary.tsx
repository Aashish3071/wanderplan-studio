import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AIGeneratedItinerary, SimpleActivity, SimpleDay } from '@/types/itinerary';
import MapView, { MapLocation } from '@/components/map/MapView';
import AIGeneratingStatus from '@/components/ui/AIGeneratingStatus';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Info,
  Camera,
  Sparkles,
  Map,
  Wand2,
} from 'lucide-react';

export default function TestItineraryPage() {
  const { data: session } = useSession();
  const [itinerary, setItinerary] = useState<AIGeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiStatus, setAiStatus] = useState<'idle' | 'generating' | 'error' | 'success'>('idle');
  const [activeDay, setActiveDay] = useState(1);
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setAiStatus('generating');
        // Simulate AI generation delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await fetch('/mock-data/sample-itinerary.json');
        if (!response.ok) throw new Error('Failed to load mock itinerary');
        const data = await response.json();
        setItinerary(data);
        setAiStatus('success');
      } catch (err) {
        setError('Error loading itinerary data');
        setAiStatus('error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, []);

  // Generate a new itinerary
  const generateNewItinerary = async () => {
    setLoading(true);
    setAiStatus('generating');

    try {
      // Simulate AI generation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch('/mock-data/sample-itinerary.json');
      if (!response.ok) throw new Error('Failed to load mock itinerary');
      const data = await response.json();
      setItinerary(data);
      setAiStatus('success');
    } catch (err) {
      setError('Error generating new itinerary');
      setAiStatus('error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Convert itinerary activities to map locations
  const mapLocations: MapLocation[] =
    itinerary?.days?.flatMap((day) =>
      day.activities.map((activity) => ({
        title: activity.title,
        location: activity.location,
        coordinates: activity.coordinates,
        imageUrl: activity.imageUrl,
        day: day.day,
        time: activity.time,
      }))
    ) || [];

  // Filter map locations based on active day
  const filteredMapLocations = mapLocations.filter((location) => location.day === activeDay);

  // Handle drag and drop
  const onDragEnd = (result: any) => {
    if (!result.destination || !itinerary) return;

    const { source, destination } = result;
    const dayIndex = parseInt(source.droppableId.split('-')[1]) - 1;

    // Clone the itinerary
    const updatedItinerary = { ...itinerary };
    const updatedDays = [...updatedItinerary.days];
    const targetDay = { ...updatedDays[dayIndex] };

    // Clone the activities array
    const updatedActivities = [...targetDay.activities];

    // Remove the dragged item from its original position
    const [movedItem] = updatedActivities.splice(source.index, 1);

    // Insert the dragged item at the new position
    updatedActivities.splice(destination.index, 0, movedItem);

    // Update the day with the reordered activities
    targetDay.activities = updatedActivities;
    updatedDays[dayIndex] = targetDay;

    // Update the itinerary
    updatedItinerary.days = updatedDays;
    setItinerary(updatedItinerary);
  };

  if (loading && aiStatus !== 'success') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <AIGeneratingStatus status={aiStatus} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <AIGeneratingStatus
          status="error"
          message="We couldn't generate your itinerary. Make sure you've run 'npm run generate-mock' to create sample data."
        />
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Test Itinerary | WanderPlan</title>
      </Head>
      <div className="container mx-auto mt-20 max-w-6xl p-4">
        {/* Hero Section with Background Image */}
        {itinerary && (
          <div
            className="relative mb-8 h-64 animate-fade-in overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl"
            style={{
              backgroundImage: `url(/images/itinerary/paris1.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-8">
              <div className="max-w-2xl">
                <h1 className="mb-2 text-4xl font-bold text-white">AI Generated Itinerary</h1>
                <p className="text-white/90">{itinerary.summary}</p>
              </div>
              <div className="absolute right-4 top-4 flex gap-2">
                <button
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  className="flex items-center gap-1 rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-800 shadow transition-colors hover:bg-white"
                >
                  {isCustomizing ? 'Save Order' : 'Customize'}
                </button>
                <button
                  onClick={generateNewItinerary}
                  className="flex items-center gap-1 rounded-md bg-primary/90 px-3 py-1.5 text-sm font-medium text-white shadow transition-colors hover:bg-primary"
                >
                  <Wand2 className="h-4 w-4" />
                  <span>Generate New</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {itinerary && (
          <>
            {/* Day Navigation Tabs */}
            <div className="sticky top-20 z-20 -mx-4 mb-6 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm">
              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
                <span className="flex min-w-max items-center text-sm font-medium text-gray-700">
                  <Calendar className="mr-1.5 h-4 w-4 text-primary" />
                  View day:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveDay(0)}
                    className={`flex min-w-max items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      activeDay === 0
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>All Days</span>
                  </button>
                  {itinerary.days.map((day) => (
                    <button
                      key={day.day}
                      onClick={() => setActiveDay(day.day)}
                      className={`flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        activeDay === day.day
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>Day {day.day}</span>
                      {activeDay === day.day && (
                        <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-primary">
                          {day.activities.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Map Section */}
            <div className="mb-8 transform overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-500 hover:shadow-xl">
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
                <div>
                  <h2 className="mb-1 text-xl font-semibold text-gray-800">Interactive Trip Map</h2>
                  <p className="text-sm text-gray-600">
                    {activeDay === 0
                      ? `Explore all ${mapLocations.length} places in your itinerary`
                      : `Viewing ${filteredMapLocations.length} places for Day ${activeDay}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveDay(0)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      activeDay === 0
                        ? 'bg-primary/20 text-primary'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    View All
                  </button>
                </div>
              </div>
              <MapView
                center={itinerary.mapCenter}
                locations={filteredMapLocations.length ? filteredMapLocations : mapLocations}
                height="500px"
              />
            </div>

            {/* Daily Itinerary */}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="space-y-8">
                {/* 
                  For All Days (activeDay === 0), show all days
                  For specific day, filter to show only that day
                */}
                {itinerary.days
                  .filter((day) => activeDay === 0 || day.day === activeDay)
                  .map((day, dayIdx) => (
                    <div
                      key={day.day}
                      className="transform overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                      style={{
                        animationDelay: `${dayIdx * 150}ms`,
                        animation: 'fadeIn 0.5s ease forwards',
                      }}
                    >
                      {/* Day Header */}
                      <div
                        className="relative h-40 border-b"
                        style={{
                          backgroundImage: `url(${day.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6">
                          <div>
                            <h3 className="text-2xl font-bold text-white">
                              Day {day.day}: {day.title}
                            </h3>
                            <div className="mt-1 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-white/80" />
                              <p className="text-sm text-white/80">{day.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Activities */}
                      <Droppable
                        droppableId={`day-${day.day}`}
                        isDropDisabled={!isCustomizing}
                        type={`day-${day.day}-activities`}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="divide-y"
                          >
                            {day.activities.map((activity, index) => (
                              <Draggable
                                key={`${day.day}-${index}`}
                                draggableId={`activity-${day.day}-${index}`}
                                index={index}
                                isDragDisabled={!isCustomizing}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`group p-5 transition-all duration-300 hover:bg-gray-50 ${
                                      isCustomizing ? 'cursor-move hover:bg-blue-50' : ''
                                    } ${snapshot.isDragging ? 'scale-[1.02] bg-blue-50 shadow-md' : ''}`}
                                    style={{
                                      ...provided.draggableProps.style,
                                      animationDelay: `${index * 100}ms`,
                                      animation: 'fadeIn 0.5s ease forwards',
                                    }}
                                  >
                                    <div className="gap-5 sm:flex">
                                      {/* Activity Image */}
                                      <div className="relative mb-4 h-40 transform overflow-hidden rounded-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-md sm:mb-0 sm:w-1/4 sm:max-w-[220px]">
                                        {activity.imageUrl ? (
                                          <img
                                            src={activity.imageUrl}
                                            alt={activity.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                          />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                            <Camera className="h-8 w-8 text-gray-400" />
                                          </div>
                                        )}
                                        <div className="absolute left-2 top-2 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-primary shadow-sm">
                                          {activity.time}
                                        </div>
                                        {isCustomizing && (
                                          <div className="absolute bottom-2 right-2 rounded-full bg-black/20 p-1.5">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90">
                                              <svg
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                className="text-gray-600"
                                              >
                                                <rect
                                                  y="0"
                                                  width="14"
                                                  height="2"
                                                  rx="1"
                                                  fill="currentColor"
                                                />
                                                <rect
                                                  y="4"
                                                  width="14"
                                                  height="2"
                                                  rx="1"
                                                  fill="currentColor"
                                                />
                                                <rect
                                                  y="8"
                                                  width="14"
                                                  height="2"
                                                  rx="1"
                                                  fill="currentColor"
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                      </div>

                                      {/* Activity Details */}
                                      <div className="flex-1 transform transition-all duration-300 group-hover:translate-x-1">
                                        <h4 className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
                                          {activity.title}
                                        </h4>

                                        <div className="mt-2 flex flex-wrap gap-3">
                                          <div className="flex items-center text-sm text-gray-700">
                                            <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                                            <span>{activity.location}</span>
                                          </div>
                                          <div className="flex items-center text-sm text-gray-700">
                                            <Clock className="mr-1 h-4 w-4 text-gray-500" />
                                            <span>{activity.time}</span>
                                          </div>
                                          <div className="flex items-center text-sm text-gray-700">
                                            <DollarSign className="mr-1 h-4 w-4 text-gray-500" />
                                            <span>${activity.cost}</span>
                                          </div>
                                        </div>

                                        <p className="mt-3 line-clamp-3 text-gray-600 transition-all duration-300 group-hover:line-clamp-none">
                                          {activity.description}
                                        </p>

                                        <div className="mt-4 flex gap-2">
                                          <button className="flex items-center rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
                                            <Info className="mr-1 h-3.5 w-3.5" />
                                            View Details
                                          </button>
                                          <button className="flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200">
                                            <Sparkles className="mr-1 h-3.5 w-3.5" />
                                            Find Alternatives
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
              </div>
            </DragDropContext>

            {/* Help Text */}
            {isCustomizing && (
              <div className="mt-4 flex items-start rounded-lg bg-blue-50 p-4">
                <Info className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Customization mode active:</span> Drag and drop
                  activities to reorder them based on your preferences. Click "Save Order" when
                  you're done.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <button className="rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50">
                Download PDF
              </button>
              <button className="rounded-md bg-primary px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-primary/90">
                Save This Itinerary
              </button>
            </div>
          </>
        )}

        {/* Fixed Action Button */}
        {itinerary && (
          <div className="fixed bottom-6 right-6 z-30">
            <div className="flex flex-col items-end space-y-2">
              {isCustomizing && (
                <button
                  onClick={() => setIsCustomizing(false)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all hover:bg-blue-600"
                  title="Save customizations"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                </button>
              )}
              <button
                onClick={() => (!isCustomizing ? setIsCustomizing(true) : null)}
                className={`flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:bg-primary/90 ${isCustomizing ? 'opacity-50' : ''}`}
                disabled={isCustomizing}
                title={isCustomizing ? 'Finish customizing first' : 'Save itinerary'}
              >
                {isCustomizing ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
