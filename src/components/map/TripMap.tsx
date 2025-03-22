import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

// Default map container style
const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '300px',
  borderRadius: '0.75rem',
};

// Default center (will be overridden by props)
const defaultCenter = {
  lat: 48.8566,
  lng: 2.3522, // Paris coordinates as default
};

// Map options with styling
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

// Google Maps API key should be set in environment variables
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';

export interface Location {
  title: string;
  location: string;
  coordinates: { lat: number; lng: number };
  imageUrl?: string;
  day?: number;
  time?: string;
}

interface TripMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  locations: Location[];
  height?: string | number;
  showInfoOnHover?: boolean;
}

const TripMap: React.FC<TripMapProps> = ({
  center = defaultCenter,
  zoom = 13,
  locations,
  height = '400px',
  showInfoOnHover = false,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Calculate map bounds to fit all markers
  const fitBounds = useCallback(() => {
    if (map && locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach((location) => {
        if (
          location.coordinates &&
          typeof location.coordinates.lat === 'number' &&
          typeof location.coordinates.lng === 'number'
        ) {
          bounds.extend(new google.maps.LatLng(location.coordinates.lat, location.coordinates.lng));
        }
      });
      map.fitBounds(bounds);

      // Don't zoom in too far on small areas
      const listener = google.maps.event.addListener(map, 'idle', () => {
        const zoom = map.getZoom();
        if (zoom !== undefined && zoom > 16) {
          map.setZoom(16);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [map, locations]);

  // Handle map load complete
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      if (locations.length > 1) {
        fitBounds();
      }
    },
    [fitBounds, locations.length]
  );

  // Handle map unmount
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Generate a unique color for each day
  const getDayColor = (day: number | undefined) => {
    if (!day) return '#ff4961'; // default red

    const colors = [
      '#4c6ef5', // indigo
      '#ff4961', // red
      '#40bfff', // blue
      '#3e8505', // green
      '#f77f00', // orange
      '#9c27b0', // purple
      '#795548', // brown
      '#607d8b', // blue-grey
    ];

    return colors[(day - 1) % colors.length];
  };

  if (loadError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-700">Error loading maps</div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height, minHeight: containerStyle.minHeight }}
      >
        <div className="inline-flex items-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
          <span className="ml-2">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height, width: '100%' }} className="relative overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onMapLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={location.coordinates}
            title={location.title}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: getDayColor(location.day),
              fillOpacity: 0.8,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            }}
            onClick={() => setSelectedLocation(location)}
            onMouseOver={() => showInfoOnHover && setSelectedLocation(location)}
            onMouseOut={() => showInfoOnHover && setSelectedLocation(null)}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={selectedLocation.coordinates}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="max-w-xs overflow-hidden text-gray-900">
              <div className="font-medium">{selectedLocation.title}</div>
              {selectedLocation.location && (
                <div className="mt-1 text-sm text-gray-700">{selectedLocation.location}</div>
              )}
              {selectedLocation.day && (
                <div className="mt-1 text-xs text-gray-500">
                  Day {selectedLocation.day}
                  {selectedLocation.time ? ` • ${selectedLocation.time}` : ''}
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Map Legend */}
      {locations.some((loc) => loc.day !== undefined) && (
        <div className="absolute bottom-2 left-2 z-10 rounded-lg bg-white/90 p-2 text-xs shadow-md backdrop-blur-sm">
          <div className="mb-1 font-medium">Trip Days</div>
          {Array.from(new Set(locations.map((loc) => loc.day).filter(Boolean))).map((day) => (
            <div key={day} className="mt-1 flex items-center">
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: getDayColor(day as number) }}
              ></div>
              <span>Day {day}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripMap;
