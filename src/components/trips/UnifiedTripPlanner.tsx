import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@/components/toast/ToastContext';
import {
  Sparkles,
  CalendarIcon,
  DollarSign,
  Users,
  MapPin,
  Tag,
  Send,
  Loader2,
  Search,
  Calendar,
  CreditCard,
  Globe,
  ArrowLeft,
  Image as ImageIcon,
  Info,
  CheckCircle,
  ChevronDown,
  Clock,
  MapPinned,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
  Minus,
  Map,
  Navigation,
} from 'lucide-react';
import { TripStatus } from '@prisma/client';
import { AutoSuggest, Suggestion } from '@/components/ui/auto-suggest';
import { Tooltip } from '@/components/ui/tooltip';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import {
  popularDestinations,
  generateTripNameSuggestions,
  recommendTravelDates,
  getCurrentSeason,
} from '@/data/popular-destinations';
import { MotivationalCard } from '@/components/ui/motivational-card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { format } from 'date-fns';
import MapView, { MapLocation } from '@/components/map/MapView';
import ItineraryPreview from '@/components/trips/ItineraryPreview';

interface FormData {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  budget: string;
  travelers: string;
  interests: string[];
  isPublic: boolean;
  status: TripStatus;
  coverImage: File | null;
}

// New interfaces for the AI-generated itinerary
interface Activity {
  title: string;
  description: string;
  time: string;
  cost: number;
  location?: string;
  imageUrl?: string;
  coordinates?: { lat: number; lng: number };
}

interface DayPlan {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
  imageUrl?: string;
}

interface ItineraryPreview {
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget: number | null;
  budgetUsed?: number;
  summary: string;
  days: DayPlan[];
  heroImage?: string;
  mapCenter?: { lat: number; lng: number };
}

const interests = [
  'Art & Museums',
  'Food & Dining',
  'Nature & Outdoors',
  'Shopping',
  'Culture & History',
  'Adventure',
  'Relaxation',
  'Nightlife',
  'Family',
  'Romance',
];

// Travel group sizes
const travelGroupSizes = [
  { value: '1', label: '1 - Solo Travel' },
  { value: '2', label: '2 - Couple/Friend' },
  { value: '3', label: '3 - Small Group' },
  { value: '4', label: '4 - Family' },
  { value: '5', label: '5 - Small Group' },
  { value: '6', label: '6 - Medium Group' },
  { value: '8', label: '8 - Large Group' },
  { value: '10', label: '10+ - Very Large Group' },
];

// Enhanced calendar component
interface CustomCalendarProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  minDate?: Date;
  label?: string;
}

const CustomCalendar = ({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
  label = 'Select Date',
}: CustomCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigate to previous month
  const prevMonth = () => {
    const prevMonthDate = new Date(currentMonth);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
    setCurrentMonth(prevMonthDate);
  };

  // Navigate to next month
  const nextMonth = () => {
    const nextMonthDate = new Date(currentMonth);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    setCurrentMonth(nextMonthDate);
  };

  // Generate array of days in month
  const getDaysArray = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create array with empty spaces for previous month days
    const days = Array(startingDayOfWeek).fill(null);

    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Format date as YYYY-MM-DD
  const formatDateForInput = (date: Date): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Check if date is today
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelectedDate = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    try {
      const selected = new Date(selectedDate);
      return (
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear()
      );
    } catch (error) {
      return false;
    }
  };

  // Check if date is past minimum date
  const isDateDisabled = (date: Date | null | string): boolean => {
    if (!date || !minDate) return false;
    if (typeof date === 'string') {
      try {
        return new Date(date) < minDate;
      } catch (error) {
        return false;
      }
    }
    return date < minDate;
  };

  // Handle date selection
  const handleDateClick = (date: Date | null) => {
    if (!date || isDateDisabled(date)) return;
    onDateSelect(formatDateForInput(date));
    setCalendarOpen(false);
  };

  const days = getDaysArray();
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className="relative" ref={calendarRef}>
      <label className="mb-1 block text-xs font-medium text-gray-700">{label}</label>
      <div
        className={`flex w-full items-center rounded-md border ${
          isDateDisabled(selectedDate) ? 'border-red-300' : 'border-gray-300'
        } bg-white py-2 pl-3 pr-2 shadow-sm hover:border-primary`}
        onClick={() => setCalendarOpen(!calendarOpen)}
      >
        <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
        <span className={`flex-1 ${selectedDate ? 'text-gray-900' : 'text-gray-500'}`}>
          {selectedDate
            ? new Date(selectedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Select date'}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </div>

      {calendarOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white p-3 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.map((day) => (
              <div key={day} className="py-1 text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}

            {days.map((date, index) => (
              <div key={index} className="p-0.5">
                {date ? (
                  <button
                    type="button"
                    onClick={() => handleDateClick(date)}
                    disabled={isDateDisabled(date)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm
                      ${isSelectedDate(date) ? 'bg-primary text-white' : ''}
                      ${isToday(date) && !isSelectedDate(date) ? 'border border-primary text-primary' : ''}
                      ${!isSelectedDate(date) && !isToday(date) ? 'hover:bg-gray-100' : ''}
                      ${isDateDisabled(date) ? 'cursor-not-allowed text-gray-300' : 'text-gray-700'}
                    `}
                  >
                    {date.getDate()}
                  </button>
                ) : (
                  <div className="h-8 w-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function UnifiedTripPlanner() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    budget: '',
    travelers: '1',
    interests: [],
    isPublic: false,
    status: 'PLANNING',
    coverImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [showDateRecommendation, setShowDateRecommendation] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [motivationalMessage, setMotivationalMessage] = useState<{
    show: boolean;
    type: 'progress' | 'destination' | 'adventure';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'progress',
    title: '',
    message: '',
  });
  const [destinationImage, setDestinationImage] = useState<string | null>(null);
  const [isAIMode, setIsAIMode] = useState(true);

  const [previewMode, setPreviewMode] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [itineraryPreview, setItineraryPreview] = useState<ItineraryPreview | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Responsive layout helpers
  const isSmallScreen = useCallback(() => {
    return typeof window !== 'undefined' && window.innerWidth < 640;
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  // Set up responsive state detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(isSmallScreen());
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isSmallScreen]);

  // Calculate form progress
  useEffect(() => {
    let progress = 0;
    const requiredFields = [
      formData.destination,
      formData.startDate,
      formData.endDate,
      formData.budget,
      formData.travelers,
    ];
    const filledFields = requiredFields.filter((field) => field).length;
    progress = (filledFields / requiredFields.length) * 100;

    // Add bonus for optional fields
    if (formData.title) progress += 5;
    if (formData.description) progress += 5;
    if (formData.interests.length > 0) progress += 5;
    if (formData.coverImage) progress += 5;

    // Ensure the progress doesn't exceed 100%
    setFormProgress(Math.round(Math.min(progress, 100)));
  }, [formData]);

  // Generate title suggestions when destination changes
  useEffect(() => {
    if (formData.destination.length > 2) {
      const suggestions = generateTripNameSuggestions(formData.destination, getCurrentSeason());
      setTitleSuggestions(suggestions);
    } else {
      setTitleSuggestions([]);
    }
  }, [formData.destination]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleTitleSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
    }));
  };

  // Generate AI preview
  const generatePreview = async () => {
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      setError('Please fill in the destination and date fields first.');
      showToast('error', 'Please fill in all required fields first.');
      return;
    }

    setLoadingPreview(true);
    setError(null);

    try {
      showToast('info', 'Generating your personalized trip itinerary...');

      const response = await fetch('/api/trips/ai-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: formData.budget ? parseInt(formData.budget) : null,
          interests: formData.interests,
          travelers: parseInt(formData.travelers || '1'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary preview');
      }

      const data = await response.json();
      setItineraryPreview(data.itinerary);
      setShowPreview(true);
      showToast('success', 'Your trip preview is ready!');
    } catch (err: any) {
      setError(err.message || 'Failed to generate itinerary preview. Please try again.');
      showToast('error', err.message || 'Failed to generate itinerary preview. Please try again.');
    } finally {
      setLoadingPreview(false);
    }
  };

  // Create the actual trip after preview approval
  const createTrip = async () => {
    if (!itineraryPreview) return;

    setLoading(true);
    setError(null);

    try {
      showToast('info', 'Creating your trip...');

      // Create trip data
      const tripData = {
        title: formData.title || `Trip to ${formData.destination}`,
        description: formData.description || itineraryPreview.summary,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget ? parseInt(formData.budget) : undefined,
        travelers: parseInt(formData.travelers || '1'),
        interests: formData.interests,
        isPublic: formData.isPublic,
        status: formData.status,
        itinerary: itineraryPreview,
      };

      // Call the API to create the trip
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      const data = await response.json();

      // Handle cover image upload if provided
      if (formData.coverImage && data.data.id) {
        const imageData = new FormData();
        imageData.append('coverImage', formData.coverImage);

        await fetch(`/api/trips/${data.data.id}/cover-image`, {
          method: 'POST',
          body: imageData,
        });
      }

      showToast('success', 'Trip created successfully!');

      // Redirect to the trip page
      router.push(`/trips/${data.data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create trip. Please try again.');
      showToast('error', err.message || 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched on submit
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouchedFields(allTouched);

    if (!validateDateRange()) {
      setError('End date must be after start date');
      return;
    }

    if (
      !formData.destination ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.budget ||
      !formData.travelers
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (showPreview && itineraryPreview) {
      // If we're already showing the preview, create the actual trip
      await createTrip();
    } else {
      // Generate preview first
      await generatePreview();
    }
  };

  const validateDateRange = () => {
    if (!formData.startDate || !formData.endDate) return true;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return start <= end;
  };

  const applyRecommendedDates = () => {
    if (!formData.destination) return;
    const recommended = recommendTravelDates(formData.destination);
    setFormData((prev) => ({
      ...prev,
      startDate: recommended.startDate,
      endDate: recommended.endDate,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Enhanced Hero Section with Background Image */}
      <div className="relative overflow-hidden" style={{ height: isMobile ? '250px' : '350px' }}>
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-primary/40 to-primary/30"></div>

        <div className="container relative mx-auto flex h-full flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-4xl lg:text-5xl">
              Your Dream Trip, <span className="text-yellow-300">Planned in Minutes</span>
            </h1>
            <p className="mt-4 text-base text-white/90 drop-shadow sm:text-lg">
              Let our AI travel assistant create a personalized itinerary just for you.
              <br className="hidden sm:inline" />
              <span className="font-medium">No more hours of research!</span>
            </p>

            <div className="mt-6 flex justify-center space-x-3">
              <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                <CheckCircle className="mr-2 h-4 w-4 text-green-300" />
                <span>100% Personalized</span>
              </div>

              <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                <CheckCircle className="mr-2 h-4 w-4 text-green-300" />
                <span>AI-Powered</span>
              </div>

              <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                <CheckCircle className="mr-2 h-4 w-4 text-green-300" />
                <span>Instant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto -mt-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Form or Preview */}
        <div id="trip-form" className="mx-auto max-w-3xl scroll-mt-8">
          {showPreview && itineraryPreview ? (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900 sm:text-xl">
                    Your Trip Preview
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <EyeOff className="mr-2 h-4 w-4" />
                    Back to Form
                  </button>
                </div>

                {/* Use the improved ItineraryPreview component */}
                <ItineraryPreview
                  title={formData.title || `Trip to ${itineraryPreview.destination}`}
                  destination={itineraryPreview.destination}
                  summary={itineraryPreview.summary}
                  days={itineraryPreview.days.map((day) => ({
                    ...day,
                    activities: day.activities.map((activity) => ({
                      ...activity,
                      location: activity.location || '',
                      coordinates: activity.coordinates || { lat: 0, lng: 0 },
                    })),
                  }))}
                  mapCenter={itineraryPreview.mapCenter || { lat: 0, lng: 0 }}
                  totalBudget={
                    itineraryPreview.totalBudget !== null ? itineraryPreview.totalBudget : undefined
                  }
                  budgetUsed={itineraryPreview.budgetUsed}
                  startDate={new Date(itineraryPreview.startDate).toLocaleDateString()}
                  endDate={new Date(itineraryPreview.endDate).toLocaleDateString()}
                  travelers={parseInt(formData.travelers)}
                  onStartTrip={createTrip}
                  loading={loading}
                />
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:space-y-8 sm:p-6">
                {/* Progress Indicator */}
                <div className="mb-4 rounded-lg bg-gray-50 p-4 sm:mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">
                      Complete Your Trip Details
                    </h3>
                    <span className="text-xs font-medium text-gray-500">
                      {formProgress}% Complete
                    </span>
                  </div>
                  <ProgressIndicator
                    percentage={formProgress}
                    title="Trip Planning Progress"
                    showCheckmark={formProgress === 100}
                    size="sm"
                    animated
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Fill in the required fields (*) to generate your personalized trip plan
                  </p>
                </div>

                {/* Destination with Auto-suggest */}
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                    Where are you going?*
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <AutoSuggest
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      onSelect={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          destination: value,
                        }));
                        setTouchedFields((prev) => ({
                          ...prev,
                          destination: true,
                        }));
                      }}
                      placeholder="e.g. Paris, France"
                      suggestions={popularDestinations.map((dest) => ({
                        id: dest.id,
                        text: dest.name,
                        value: dest.name,
                      }))}
                      required
                      error={touchedFields.destination && !formData.destination}
                    />
                  </div>
                  {touchedFields.destination && !formData.destination && (
                    <p className="mt-1 text-xs text-red-500">
                      Please tell us where you're traveling to
                    </p>
                  )}
                </div>

                {/* AI-Generated Title with better suggestion interface */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Name your trip
                    </label>
                    {titleSuggestions.length > 0 && (
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            title:
                              titleSuggestions[Math.floor(Math.random() * titleSuggestions.length)],
                          }))
                        }
                      >
                        <Sparkles className="mr-1 h-3 w-3" />
                        Generate AI Title
                      </button>
                    )}
                  </div>

                  {titleSuggestions.length > 0 ? (
                    <div className="relative z-30">
                      <AutoSuggest
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onSelect={handleTitleSelect}
                        placeholder="e.g. Summer in Paris"
                        suggestions={titleSuggestions.map((title, i) => ({
                          id: i.toString(),
                          text: title,
                          value: title,
                        }))}
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Summer in Paris"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  )}

                  {titleSuggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {titleSuggestions.slice(0, 3).map((title, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleTitleSelect(title)}
                          className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
                        >
                          {title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Enhanced Date Range Picker with Custom Calendar */}
                <div className="space-y-4 pt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    When are you traveling?*
                  </label>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <CustomCalendar
                      selectedDate={formData.startDate}
                      onDateSelect={(date) => {
                        setFormData((prev) => ({ ...prev, startDate: date }));
                        setTouchedFields((prev) => ({ ...prev, startDate: true }));

                        // If end date is before start date, reset it
                        if (formData.endDate && new Date(date) > new Date(formData.endDate)) {
                          setFormData((prev) => ({ ...prev, endDate: '' }));
                        }
                      }}
                      minDate={new Date()}
                      label="Start Date*"
                    />

                    <CustomCalendar
                      selectedDate={formData.endDate}
                      onDateSelect={(date) => {
                        setFormData((prev) => ({ ...prev, endDate: date }));
                        setTouchedFields((prev) => ({ ...prev, endDate: true }));
                      }}
                      minDate={formData.startDate ? new Date(formData.startDate) : new Date()}
                      label="End Date*"
                    />
                  </div>

                  <p className="text-xs italic text-gray-500">
                    Choose your travel dates for a personalized itinerary
                  </p>

                  {formData.startDate && formData.endDate && !validateDateRange() && (
                    <p className="text-xs text-red-600">
                      Your end date must be after your start date
                    </p>
                  )}
                </div>

                {/* Enhanced Budget and Travelers */}
                <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2">
                  {/* Enhanced Budget Input */}
                  <div className="space-y-2">
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                      What's your budget?*
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="e.g. 1000"
                        required
                        className={`block w-full rounded-md border-gray-300 py-3 pl-10 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                          touchedFields.budget && !formData.budget ? 'border-red-500' : ''
                        }`}
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-sm text-gray-500">USD</span>
                      </div>
                    </div>
                    {touchedFields.budget && !formData.budget && (
                      <p className="mt-1 text-xs text-red-500">Please enter your total budget</p>
                    )}
                  </div>

                  {/* Enhanced Travelers Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="travelers" className="block text-sm font-medium text-gray-700">
                      How many travelers?*
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="travelers"
                        name="travelers"
                        value={formData.travelers}
                        onChange={handleChange}
                        required
                        className={`block w-full appearance-none rounded-md border-gray-300 py-3 pl-10 pr-8 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                          touchedFields.travelers && !formData.travelers ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="" disabled>
                          Select group size
                        </option>
                        {travelGroupSizes.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    {touchedFields.travelers && !formData.travelers && (
                      <p className="mt-1 text-xs text-red-500">
                        Please select the number of travelers
                      </p>
                    )}
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-1 pt-2 sm:space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    What are your interests?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm transition-colors ${
                          formData.interests.includes(interest)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Tag className="mr-1 h-3.5 w-3.5" />
                        {interest}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Select interests to customize your travel recommendations
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      loadingPreview ||
                      !formData.destination ||
                      !formData.startDate ||
                      !formData.endDate ||
                      !formData.budget ||
                      !formData.travelers ||
                      !validateDateRange()
                    }
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingPreview ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Your Trip...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Plan My Trip
                      </>
                    )}
                  </button>
                </div>

                {/* Help Information */}
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">How it works</h3>
                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                        <p>1. Fill in your trip details above</p>
                        <p>2. Our AI will generate a complete custom itinerary</p>
                        <p>3. Review and save your personalized travel plan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
