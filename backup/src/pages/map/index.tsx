import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, MapPin, Globe, Info } from 'lucide-react';

// Declare global window interface with google maps
declare global {
  interface Window {
    google: any;
  }
}

type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  isPublic: boolean;
  coverImage: string | null;
  createdAt: string;
  userId: string;
  // For map display
  coordinates?: {
    lat: number;
    lng: number;
  };
};

// Mock coordinates for sample destinations
const destinationCoordinates: Record<string, { lat: number; lng: number }> = {
  'Paris, France': { lat: 48.8566, lng: 2.3522 },
  'New York, USA': { lat: 40.7128, lng: -74.0060 },
  'Tokyo, Japan': { lat: 35.6762, lng: 139.6503 },
  'Rome, Italy': { lat: 41.9028, lng: 12.4964 },
  'London, UK': { lat: 51.5074, lng: -0.1278 },
  'Sydney, Australia': { lat: -33.8688, lng: 151.2093 },
};

export default function Map() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Load trips from localStorage
    try {
      const storedTrips = JSON.parse(localStorage.getItem('trips') || '[]');
      
      // Add mock coordinates to trips
      const tripsWithCoordinates = storedTrips.map((trip: Trip) => {
        const coordinates = destinationCoordinates[trip.destination] || {
          // Default to Paris if no match
          lat: 48.8566 + (Math.random() * 10 - 5),
          lng: 2.3522 + (Math.random() * 10 - 5)
        };
        
        return {
          ...trip,
          coordinates
        };
      });
      
      setTrips(tripsWithCoordinates);
    } catch (err) {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
    
    // Load map script
    const mapScript = document.createElement('script');
    mapScript.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    mapScript.async = true;
    mapScript.defer = true;
    mapScript.onload = () => {
      setMapLoaded(true);
    };
    
    document.head.appendChild(mapScript);
    
    return () => {
      // Remove script on component unmount
      if (document.head.contains(mapScript)) {
        document.head.removeChild(mapScript);
      }
    };
  }, []);

  useEffect(() => {
    if (mapLoaded && trips.length > 0) {
      initializeMap();
    }
  }, [mapLoaded, trips]);

  const initializeMap = () => {
    const mapElement = document.getElementById('map');
    if (!mapElement || !window.google) return;
    
    // Calculate the bounds of all trip locations
    const bounds = new window.google.maps.LatLngBounds();
    
    // Create map
    const map = new window.google.maps.Map(mapElement, {
      center: { lat: 20, lng: 0 }, // Default center (will be adjusted by bounds)
      zoom: 2,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });
    
    // Add markers for each trip
    trips.forEach((trip) => {
      if (!trip.coordinates) return;
      
      const marker = new window.google.maps.Marker({
        position: trip.coordinates,
        map,
        title: trip.title,
        animation: window.google.maps.Animation.DROP,
      });
      
      // Add click event to marker
      marker.addListener('click', () => {
        setSelectedTrip(trip);
        
        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="max-width: 200px; padding: 10px;">
              <h3 style="margin: 0 0 5px; font-size: 16px;">${trip.title}</h3>
              <p style="margin: 0 0 5px; font-size: 14px;">${trip.destination}</p>
              <a href="/trips/${trip.id}" style="color: #3b82f6; font-size: 14px;">View Trip</a>
            </div>
          `,
        });
        
        infoWindow.open(map, marker);
      });
      
      // Extend bounds to include this location
      bounds.extend(trip.coordinates);
    });
    
    // Fit map to bounds if we have any trips
    if (trips.length > 0) {
      map.fitBounds(bounds);
      
      // Don't zoom in too far
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 12) {
          map.setZoom(12);
        }
        window.google.maps.event.removeListener(listener);
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <>
      <Head>
        <title>Trip Map | WanderPlan Studio</title>
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="mr-4 text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Trip Map</h1>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Explore Your Trips</h2>
                </div>
                
                {trips.length === 0 ? (
                  <div className="p-6 text-center">
                    <Globe className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">No trips added yet</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Create a trip to see it on the map
                    </p>
                    <Link
                      href="/trips/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Create a Trip
                    </Link>
                  </div>
                ) : (
                  <>
                    {error ? (
                      <div className="p-6 text-center">
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
                      </div>
                    ) : (
                      <div id="map" className="h-[60vh] w-full"></div>
                    )}
                  </>
                )}
                
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
                  <p>Note: In a real implementation, you would need a valid Google Maps API key.</p>
                </div>
              </div>
            </div>
            
            {/* Trip List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Your Trips</h2>
                </div>
                
                {trips.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500">No trips to display</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 overflow-y-auto max-h-[60vh]">
                    {trips.map((trip) => (
                      <li 
                        key={trip.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedTrip?.id === trip.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedTrip(trip)}
                      >
                        <Link href={`/trips/${trip.id}`} className="block">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden mr-3 bg-gray-200">
                              {trip.coverImage ? (
                                <img
                                  src={trip.coverImage}
                                  alt={trip.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{trip.title}</p>
                              <p className="text-xs text-gray-500">{trip.destination}</p>
                              <p className="text-xs text-gray-500">
                                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <Link
                    href="/trips/new"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Add New Trip
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 