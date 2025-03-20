import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronDown,
  Search,
  CheckCircle,
  Info
} from 'lucide-react';

type Trip = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  destination: string;
};

type Place = {
  id: string;
  name: string;
  location: string;
  type: string;
  image: string;
  description?: string;
};

type Activity = {
  id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  description: string;
  placeId?: string;
  itineraryDayId: string;
  tripId: string;
  cost?: number;
  transportType?: string;
};

export default function AddActivity() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status: authStatus } = useSession({
    required: true,
    onUnauthenticated() {
      // This redirects to the login page by default
    }
  });

  const [trip, setTrip] = useState<Trip | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [itineraryDays, setItineraryDays] = useState<{ id: string, date: string }[]>([]);
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlaceSearch, setShowPlaceSearch] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  
  const [formData, setFormData] = useState<Partial<Activity>>({
    title: '',
    type: 'ACTIVITY',
    startTime: '',
    endTime: '',
    description: '',
    itineraryDayId: '',
    cost: undefined,
    transportType: undefined
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Activity types
  const activityTypes = [
    { value: 'ACTIVITY', label: 'Activity' },
    { value: 'TRANSPORT', label: 'Transport' },
    { value: 'ACCOMMODATION', label: 'Accommodation' },
    { value: 'FOOD', label: 'Food' },
    { value: 'OTHER', label: 'Other' }
  ];
  
  // Transport types
  const transportTypes = [
    { value: 'WALK', label: 'Walk' },
    { value: 'TRANSIT', label: 'Public Transit' },
    { value: 'CAR', label: 'Car' },
    { value: 'BIKE', label: 'Bike' },
    { value: 'TAXI', label: 'Taxi' },
    { value: 'PLANE', label: 'Plane' },
    { value: 'TRAIN', label: 'Train' },
    { value: 'BUS', label: 'Bus' },
    { value: 'BOAT', label: 'Boat' },
    { value: 'OTHER', label: 'Other' }
  ];

  useEffect(() => {
    if (id) {
      loadTripData();
    }
  }, [id]);
  
  const loadTripData = () => {
    try {
      // Load trip data
      const trips = JSON.parse(localStorage.getItem('trips') || '[]');
      const foundTrip = trips.find((t: Trip) => t.id === id);
      
      if (foundTrip) {
        setTrip(foundTrip);
        
        // Generate itinerary days based on trip dates
        if (foundTrip.startDate && foundTrip.endDate) {
          const startDate = new Date(foundTrip.startDate);
          const endDate = new Date(foundTrip.endDate);
          const days = [];
          
          let currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            days.push({
              id: `day-${days.length + 1}`,
              date: currentDate.toISOString().split('T')[0]
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          setItineraryDays(days);
          if (days.length > 0) {
            setFormData(prev => ({ ...prev, itineraryDayId: days[0].id }));
          }
        }
        
        // Load sample places for the destination
        const samplePlaces = [
          {
            id: 'place-1',
            name: 'Eiffel Tower',
            location: 'Paris, France',
            type: 'ATTRACTION',
            image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80',
            description: 'Iconic iron tower offering city views.'
          },
          {
            id: 'place-2',
            name: 'Louvre Museum',
            location: 'Paris, France',
            type: 'MUSEUM',
            image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80',
            description: 'World-famous art museum housing the Mona Lisa.'
          },
          {
            id: 'place-3',
            name: 'Notre Dame Cathedral',
            location: 'Paris, France',
            type: 'LANDMARK',
            image: 'https://images.unsplash.com/photo-1562109271-0d5659aac759?auto=format&fit=crop&q=80',
            description: 'Medieval Catholic cathedral on the Île de la Cité.'
          }
        ];
        
        setPlaces(samplePlaces);
        setSearchResults(samplePlaces);
      } else {
        setError('Trip not found');
      }
    } catch (err) {
      setError('Failed to load trip data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If activity type changes, reset transport type if not transport
    if (name === 'type' && value !== 'TRANSPORT') {
      setFormData(prev => ({
        ...prev,
        transportType: undefined
      }));
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults(places);
      return;
    }
    
    const filtered = places.filter(place => 
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.location.toLowerCase().includes(query.toLowerCase()) ||
      place.type.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered);
  };
  
  const selectPlace = (place: Place) => {
    setSelectedPlace(place);
    setFormData(prev => ({
      ...prev,
      title: place.name,
      description: place.description || '',
      placeId: place.id
    }));
    setShowPlaceSearch(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Validate form
      if (!formData.title || !formData.startTime || !formData.endTime || !formData.itineraryDayId) {
        throw new Error('Please fill out all required fields');
      }
      
      // Check if start time is before end time
      if (formData.startTime && formData.endTime && formData.startTime > formData.endTime) {
        throw new Error('Start time must be before end time');
      }
      
      // In a real app, save to API
      // For now, save to localStorage
      const activities = JSON.parse(localStorage.getItem('activities') || '[]');
      const newActivity = {
        id: `activity-${Date.now()}`,
        ...formData,
        tripId: id
      };
      
      activities.push(newActivity);
      localStorage.setItem('activities', JSON.stringify(activities));
      
      setSuccessMessage('Activity added successfully!');
      
      // Reset form after successful submission
      setTimeout(() => {
        router.push(`/trips/${id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to add activity');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  if (authStatus === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (error && !trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
        <Link 
          href="/trips" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Trips
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Add Activity | {trip?.title || 'Trip'} | WanderPlan Studio</title>
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <Link href={`/trips/${id}`} className="mr-4 text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add Activity</h1>
                {trip && (
                  <p className="text-gray-600">
                    <Link href={`/trips/${id}`} className="hover:text-blue-600">
                      {trip.title}
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {successMessage && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Day selection */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="itineraryDayId" className="block text-sm font-medium text-gray-700 mb-1">
                    Day*
                  </label>
                  <select
                    id="itineraryDayId"
                    name="itineraryDayId"
                    required
                    value={formData.itineraryDayId}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {itineraryDays.map((day) => (
                      <option key={day.id} value={day.id}>
                        {formatDate(day.date)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Activity Type */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Type*
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {activityTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Place Search - Button to show/hide search */}
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Place
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPlaceSearch(!showPlaceSearch)}
                      className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                    >
                      {showPlaceSearch ? 'Hide Search' : 'Search Places'}
                      <ChevronDown className={`h-4 w-4 ml-1 ${showPlaceSearch ? 'rotate-180' : ''} transition-transform`} />
                    </button>
                  </div>
                  
                  {selectedPlace && (
                    <div className="bg-blue-50 p-3 rounded-md flex items-start mb-3">
                      <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden mr-3">
                        <img
                          src={selectedPlace.image}
                          alt={selectedPlace.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{selectedPlace.name}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {selectedPlace.location}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-xs text-red-600 hover:text-red-500"
                        onClick={() => {
                          setSelectedPlace(null);
                          setFormData(prev => ({
                            ...prev,
                            placeId: undefined
                          }));
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  
                  {showPlaceSearch && (
                    <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
                      <div className="p-3 border-b border-gray-200 bg-gray-50">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search for places..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto">
                        {searchResults.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No places found. Try a different search.
                          </div>
                        ) : (
                          <ul className="divide-y divide-gray-200">
                            {searchResults.map((place) => (
                              <li
                                key={place.id}
                                className="p-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() => selectPlace(place)}
                              >
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden mr-3">
                                    <img
                                      src={place.image}
                                      alt={place.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{place.name}</p>
                                    <p className="text-xs text-gray-500 flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {place.location}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Activity Title */}
                <div className="col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Visit Eiffel Tower"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* Time Range */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time*
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      required
                      value={formData.startTime || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 pl-10 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    End Time*
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      required
                      value={formData.endTime || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 pl-10 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                {/* Cost */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                    Cost
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      id="cost"
                      name="cost"
                      value={formData.cost || ''}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                </div>
                
                {/* Transport Type - Show only if type is TRANSPORT */}
                {formData.type === 'TRANSPORT' && (
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="transportType" className="block text-sm font-medium text-gray-700 mb-1">
                      Transport Type
                    </label>
                    <select
                      id="transportType"
                      name="transportType"
                      value={formData.transportType || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select type</option>
                      {transportTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Description */}
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    placeholder="Add any notes or details about this activity"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <Link
                  href={`/trips/${id}`}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding...' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 