import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  Share2,
  Edit2,
  Trash2,
  ArrowLeft,
  Plus,
  CalendarDays, 
  Settings,
  Globe,
  Eye,
  Lock,
  ChevronDown
} from 'lucide-react';

type Trip = {
  id: string;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  isPublic: boolean;
  coverImage: string | null;
  createdAt: string;
  userId: string;
};

export default function TripDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status: authStatus } = useSession({
    required: true,
    onUnauthenticated() {
      // This redirects to the login page by default
    }
  });
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    if (id) {
      // In a real app, fetch trip data from an API
      // For now, we'll use localStorage
      try {
        const trips = JSON.parse(localStorage.getItem('trips') || '[]');
        const foundTrip = trips.find((t: Trip) => t.id === id);
        
        if (foundTrip) {
          setTrip(foundTrip);
        } else {
          setError('Trip not found');
        }
      } catch (err) {
        setError('Failed to load trip details');
      } finally {
        setLoading(false);
      }
    }
  }, [id]);
  
  const handleDeleteTrip = () => {
    try {
      const trips = JSON.parse(localStorage.getItem('trips') || '[]');
      const updatedTrips = trips.filter((t: Trip) => t.id !== id);
      localStorage.setItem('trips', JSON.stringify(updatedTrips));
      
      // Redirect back to trips list
      router.push('/trips');
    } catch (err) {
      setError('Failed to delete trip');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  if (authStatus === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (error) {
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
  
  if (!trip) {
    return <div className="flex items-center justify-center min-h-screen">Trip not found</div>;
  }
  
  return (
    <>
      <Head>
        <title>{trip.title} | WanderPlan Studio</title>
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header with trip image */}
        <div className="relative">
          <div className="h-64 md:h-80 bg-gray-300 relative">
            {trip.coverImage ? (
              <img
                src={trip.coverImage}
                alt={trip.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-blue-100">
                <Globe className="h-16 w-16 text-blue-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative -mt-12 sm:-mt-16 mb-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Link
                    href="/trips"
                    className="text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Trips
                  </Link>
                  
                  <div className="flex space-x-2">
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-1 text-gray-500" />
                      Delete
                    </button>
                    <Link
                      href={`/trips/edit/${id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <Edit2 className="h-4 w-4 mr-1 text-gray-500" />
                      Edit
                    </Link>
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <Share2 className="h-4 w-4 mr-1 text-gray-500" />
                      Share
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{trip.title}</h1>
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {trip.status}
                      </span>
                      {trip.isPublic ? (
                        <span className="ml-2 inline-flex items-center text-xs text-gray-500">
                          <Eye className="h-3 w-3 mr-1" /> Public
                        </span>
                      ) : (
                        <span className="ml-2 inline-flex items-center text-xs text-gray-500">
                          <Lock className="h-3 w-3 mr-1" /> Private
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{trip.destination}</span>
                    </div>
                    
                    <div className="mt-4 flex flex-col sm:flex-row sm:space-x-6">
                      <div className="flex items-center text-gray-600 mb-2 sm:mb-0">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        <span>
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {calculateDuration(trip.startDate, trip.endDate)} days
                        </span>
                      </div>
                    </div>
                    
                    {trip.description && (
                      <div className="mt-4 text-gray-700">
                        <p>{trip.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`${
                  activeTab === 'itinerary'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Itinerary
              </button>
              <button
                onClick={() => setActiveTab('places')}
                className={`${
                  activeTab === 'places'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Places
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`${
                  activeTab === 'map'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Map
              </button>
              <button
                onClick={() => setActiveTab('collaboration')}
                className={`${
                  activeTab === 'collaboration'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Collaboration
              </button>
            </nav>
          </div>
        </div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Link href={`/trips/${id}/add-activity`} className="flex flex-col items-center p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <Plus className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Add Activity</span>
                    </Link>
                    <Link href={`/trips/${id}/places`} className="flex flex-col items-center p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Find Places</span>
                    </Link>
                    <Link href={`/trips/${id}/calendar`} className="flex flex-col items-center p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Calendar</span>
                    </Link>
                    <Link href={`/trips/${id}/settings`} className="flex flex-col items-center p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <Settings className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Settings</span>
                    </Link>
                  </div>
                </div>
                
                {/* Trip Summary */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Trip Summary</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700">
                      {trip.description || "No trip description yet. Edit this trip to add a description."}
                    </p>
                    
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <h3 className="text-base font-medium text-gray-900 mb-3">Important Details</h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Destination</dt>
                          <dd className="mt-1 text-sm text-gray-900">{trip.destination}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Duration</dt>
                          <dd className="mt-1 text-sm text-gray-900">{calculateDuration(trip.startDate, trip.endDate)} days</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formatDate(trip.startDate)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">End Date</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formatDate(trip.endDate)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1 text-sm text-gray-900">{trip.status}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Visibility</dt>
                          <dd className="mt-1 text-sm text-gray-900">{trip.isPublic ? 'Public' : 'Private'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Weather Preview */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Weather</h2>
                  </div>
                  <div className="p-6 text-center">
                    <p className="text-gray-700">Weather data will appear here when available.</p>
                    <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Check weather forecast
                    </button>
                  </div>
                </div>
                
                {/* Collaborators */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Collaborators</h2>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Invite
                    </button>
                  </div>
                  <div className="p-6 text-center">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">No collaborators yet</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Invite friends to plan this trip together
                    </p>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                      <Users className="h-4 w-4 mr-2" />
                      Invite Collaborators
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'itinerary' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Itinerary</h2>
                <Link 
                  href={`/trips/${id}/add-activity`}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm leading-4 font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Link>
              </div>
              
              <div className="p-6 text-center">
                <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900">No activities planned yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Start building your itinerary by adding activities
                </p>
                <Link
                  href={`/trips/${id}/add-activity`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Start Planning
                </Link>
              </div>
            </div>
          )}
          
          {activeTab === 'places' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Places</h2>
                <Link 
                  href={`/trips/${id}/places`}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm leading-4 font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Place
                </Link>
              </div>
              
              <div className="p-6 text-center">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900">No places added yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add places you want to visit on this trip
                </p>
                <Link
                  href={`/trips/${id}/places`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Browse Places
                </Link>
              </div>
            </div>
          )}
          
          {activeTab === 'map' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Map</h2>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-100 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">Map Coming Soon</h3>
                    <p className="text-sm text-gray-500">
                      A map of your trip destinations will appear here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'collaboration' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Collaborators</h2>
                <button
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm leading-4 font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Invite
                </button>
              </div>
              
              <div className="p-6 text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900">No collaborators yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Invite friends and family to plan this trip together
                </p>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Invite People
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Trip</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this trip? All of your data including itineraries, places, and notes will be permanently removed. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteTrip}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 