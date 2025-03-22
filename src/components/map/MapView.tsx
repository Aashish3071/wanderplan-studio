import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Map } from 'lucide-react';
import { SimpleActivity } from '@/types/itinerary';

// Map container style
const containerStyle = {
  width: '100%',
  height: '400px',
};

// Default center (Paris)
const defaultCenter = {
  lat: 48.8566,
  lng: 2.3522,
};

// Map options
const mapOptions = {
  disableDefaultUI: true,
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
  ],
};

// Day colors for markers
const dayColors = [
  '#FF5733', // Day 1 - Orange-red
  '#33FF57', // Day 2 - Green
  '#3357FF', // Day 3 - Blue
  '#F033FF', // Day 4 - Purple
  '#FF33A1', // Day 5 - Pink
  '#33FFF3', // Day 6 - Cyan
  '#F3FF33', // Day 7 - Yellow
];

export interface MapLocation {
  title: string;
  location: string;
  coordinates: { lat: number; lng: number };
  imageUrl?: string;
  day: number;
  time: string;
}

interface MapViewProps {
  center?: { lat: number; lng: number };
  locations: MapLocation[];
  height?: string;
}

const MapView: React.FC<MapViewProps> = ({
  center = defaultCenter,
  locations = [],
  height = '400px',
}) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const hasValidApiKey = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const getMarkerColor = (dayIndex: number) => {
    return dayColors[dayIndex % dayColors.length] || '#FF5733';
  };

  // Fallback UI when API key is not available or there's a loading error
  if (!hasValidApiKey || loadError) {
    return (
      <div
        style={{ height, width: '100%' }}
        className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-100"
      >
        <Map className="mb-4 h-16 w-16 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-700">Map Preview Unavailable</h3>
        <p className="mt-2 max-w-md text-center text-sm text-gray-500">
          {!hasValidApiKey
            ? 'A valid Google Maps API key is required to display the map.'
            : 'There was an error loading the map.'}
        </p>
        <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 px-4 sm:grid-cols-2 md:grid-cols-3">
          {locations.slice(0, 6).map((location, index) => (
            <div key={index} className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
              <div className="flex items-start">
                <div
                  className="mr-2 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: getMarkerColor(location.day - 1) }}
                >
                  <span className="text-xs font-medium text-white">{location.day}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{location.title}</h4>
                  <p className="text-xs text-gray-500">{location.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        style={{ height, width: '100%' }}
        className="flex items-center justify-center rounded-lg bg-gray-100"
      >
        <div className="flex animate-pulse flex-col items-center">
          <div className="mb-2 h-12 w-12 rounded-full bg-gray-300"></div>
          <div className="h-4 w-24 rounded bg-gray-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: height, width: '100%' }}>
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height }}
        center={center}
        zoom={12}
        options={mapOptions}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={location.coordinates}
            icon={{
              path: 'M12 0C5.383 0 0 5.383 0 12c0 6.617 12 20 12 20s12-13.383 12-20c0-6.617-5.383-12-12-12z',
              fillColor: getMarkerColor(location.day - 1),
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#FFFFFF',
              scale: 1,
            }}
            onClick={() => setSelectedLocation(location)}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={selectedLocation.coordinates}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="max-w-xs p-2">
              <h3 className="text-sm font-semibold">{selectedLocation.title}</h3>
              <p className="mb-1 text-xs text-gray-600">{selectedLocation.location}</p>
              <p className="text-xs text-gray-600">
                Day {selectedLocation.day} • {selectedLocation.time}
              </p>
              {selectedLocation.imageUrl && (
                <img
                  src={selectedLocation.imageUrl}
                  alt={selectedLocation.title}
                  className="mt-2 h-20 w-full rounded-md object-cover"
                />
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;
