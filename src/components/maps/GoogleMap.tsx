import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from 'lucide-react';
import { Location } from '@/types/itinerary';

interface GoogleMapProps {
  location: Location;
  height?: string;
  width?: string;
  zoom?: number;
  showCurrentLocation?: boolean;
  onCurrentLocationClick?: () => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  location,
  height = '300px',
  width = '100%',
  zoom = 15,
  showCurrentLocation = false,
  onCurrentLocationClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Load Google Maps script
  useEffect(() => {
    // Skip if already loaded
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    // Create script element
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    googleMapScript.onload = () => setMapLoaded(true);
    document.body.appendChild(googleMapScript);

    return () => {
      // Cleanup script if component unmounts before script loads
      document.body.removeChild(googleMapScript);
    };
  }, []);

  // Initialize map once script is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const mapOptions = {
      center: {
        lat: location.latitude || 0,
        lng: location.longitude || 0,
      },
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
    };

    const map = new window.google.maps.Map(mapRef.current, mapOptions);

    // Add marker for the location
    new window.google.maps.Marker({
      position: { lat: location.latitude || 0, lng: location.longitude || 0 },
      map,
      title: location.name || location.address || 'Location',
    });

    // Get current location if requested
    if (showCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCurrentLocation(currentPos);

          // Add marker for current location
          new window.google.maps.Marker({
            position: currentPos,
            map,
            title: 'Your Location',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  }, [mapLoaded, location, zoom, showCurrentLocation]);

  // Handle opening in Google Maps
  const openInGoogleMaps = () => {
    const { latitude, longitude, address } = location;

    if (latitude && longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(url, '_blank');
    } else if (address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    }
  };

  // Handle "Navigate from current location" action
  const navigateFromCurrentLocation = () => {
    if (!currentLocation) return;

    const { latitude, longitude, address } = location;

    if (latitude && longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${latitude},${longitude}`;
      window.open(url, '_blank');
    } else if (address) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    }

    if (onCurrentLocationClick) {
      onCurrentLocationClick();
    }
  };

  return (
    <div className="relative">
      <div ref={mapRef} style={{ height, width }} className="rounded-md shadow-sm" />

      {showCurrentLocation && (
        <button
          onClick={navigateFromCurrentLocation}
          className="absolute bottom-3 right-3 rounded-full bg-primary p-2 text-white shadow-md transition-colors hover:bg-primary/90"
          title="Navigate from current location"
          disabled={!currentLocation}
        >
          <Navigation size={18} />
        </button>
      )}

      <button
        onClick={openInGoogleMaps}
        className="absolute bottom-3 left-3 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-100"
      >
        Open in Google Maps
      </button>
    </div>
  );
};

export default GoogleMap;
