import React from 'react';
import { MapPin, Maximize, Navigation } from 'lucide-react';

interface MapPreviewProps {
  destination: string;
  lat?: number;
  lng?: number;
  className?: string;
  height?: string | number;
  interactive?: boolean;
  onExpand?: () => void;
}

const MapPreview: React.FC<MapPreviewProps> = ({
  destination,
  lat,
  lng,
  className = '',
  height = 200,
  interactive = true,
  onExpand,
}) => {
  // For this implementation, we'll use a static map image from OpenStreetMap
  // In a real implementation, you might want to use a map library like Leaflet or Google Maps

  const encodedDestination = encodeURIComponent(destination);

  // If lat and lng coordinates are provided, use them
  // Otherwise, use the destination name for the map
  const mapUrl =
    lat && lng
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`
      : `https://www.openstreetmap.org/export/embed.html?bbox=-10,30,40,70&layer=mapnik&marker=0,0`;

  const staticMapUrl =
    lat && lng
      ? `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=14&size=600x400&markers=${lat},${lng},red-pushpin`
      : `https://staticmap.openstreetmap.de/staticmap.php?center=0,0&zoom=1&size=600x400`;

  const handleMapClick = () => {
    if (interactive && onExpand) {
      onExpand();
    }
  };

  const mapHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-border ${className} ${interactive ? 'cursor-pointer' : ''}`}
      style={{ height: mapHeight }}
    >
      {interactive ? (
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          title={`Map of ${destination}`}
          className="border-0"
        />
      ) : (
        <img
          src={staticMapUrl}
          alt={`Map of ${destination}`}
          className="h-full w-full object-cover"
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
        <div className="flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-secondary" />
          <span className="font-medium">{destination}</span>
        </div>
      </div>

      {interactive && (
        <button
          className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-foreground shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={handleMapClick}
          aria-label="Expand map"
        >
          <Maximize className="h-4 w-4" />
        </button>
      )}

      <div className="absolute left-2 top-2 rounded-full bg-primary/90 p-1.5 text-white shadow-md">
        <Navigation className="h-4 w-4" />
      </div>
    </div>
  );
};

export default MapPreview;
