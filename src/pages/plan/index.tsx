import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Plus,
  Save,
  MoreHorizontal,
  Trash2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTrips, Trip } from '@/hooks/useTrips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { formatDateString } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

type CalendarDay = {
  day: number | null;
  isCurrentMonth: boolean;
  date?: Date;
  hasEvent?: boolean;
};

const PlannerPage = () => {
  const { data: session, status } = useSession();
  const { trips, isLoading } = useTrips({
    useMockData: true,
    initialFetch: true,
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Get active trips (either in planning or ongoing)
  const activeTrips = trips
    .filter(
      (trip) => trip.status === 'PLANNING' || trip.status === 'BOOKED' || trip.status === 'ACTIVE'
    )
    .slice(0, 3);

  // Calendar navigation
  const goToPreviousMonth = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedDate(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedDate(nextMonth);
  };

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days: CalendarDay[] = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    // Add actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push({
        day: i,
        isCurrentMonth: true,
        date: dayDate,
        hasEvent: activeTrips.some((trip) => {
          const startDate = new Date(trip.startDate);
          const endDate = new Date(trip.endDate);
          return dayDate >= startDate && dayDate <= endDate;
        }),
      });
    }

    return days;
  };

  // Get calendar data for the selected month
  const calendarDays = getDaysInMonth(selectedDate);

  // Format month and year for display
  const monthYearString = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Trip Planner | WanderPlan Studio</title>
        <meta name="description" content="Plan your upcoming trips" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Trip Planner</h1>
            <p className="text-muted-foreground">Plan your itinerary and organize your journey</p>
          </div>
          <Button asChild>
            <Link href="/trips/new">
              <Plus className="mr-2 h-4 w-4" />
              New Trip
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Upcoming Trips */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming Trips</h2>
              <Link href="/trips" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>

            {activeTrips.length > 0 ? (
              <div className="space-y-4">
                {activeTrips.map((trip) => (
                  <Card
                    key={trip.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTrip?.id === trip.id ? 'border-primary ring-1 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <CardContent className="p-4">
                      <div className="mb-2 font-medium">{trip.title}</div>
                      <div className="mb-2 flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-4 w-4" />
                        {trip.destination}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDateString(trip.startDate)} - {formatDateString(trip.endDate)}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/trips">View All Trips</Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="mb-4 text-muted-foreground">No upcoming trips found</p>
                <Button asChild>
                  <Link href="/trips/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create a Trip
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Calendar View */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Calendar</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">{monthYearString}</span>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-lg border bg-card">
              {/* Calendar grid header */}
              <div className="grid grid-cols-7 border-b">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[80px] border p-2 ${
                      !day.isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : ''
                    }`}
                  >
                    {day.day && (
                      <>
                        <div className="flex justify-between">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                              day.hasEvent ? 'bg-primary text-white' : ''
                            }`}
                          >
                            {day.day}
                          </span>
                        </div>
                        {day.hasEvent && day.date && (
                          <div className="mt-1">
                            {activeTrips
                              .filter((trip) => {
                                const startDate = new Date(trip.startDate);
                                const endDate = new Date(trip.endDate);
                                return day.date && day.date >= startDate && day.date <= endDate;
                              })
                              .map((trip) => (
                                <div
                                  key={trip.id}
                                  className="mb-1 truncate rounded bg-primary/10 px-1 py-0.5 text-xs text-primary"
                                  title={trip.title}
                                >
                                  {trip.title}
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlannerPage;
