import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Heart, Trash2, Plus, ArrowRight, Search } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  country: string;
  category: 'attraction' | 'accommodation' | 'restaurant' | 'other';
  notes?: string;
  savedAt: Date;
}

interface SavedLocationsProps {
  className?: string;
  onLocationClick?: (location: Location) => void;
}

const SavedLocations: React.FC<SavedLocationsProps> = ({ className = '', onLocationClick }) => {
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // In a real app, this would fetch from an API or database
  useEffect(() => {
    // Simulate fetching data
    const fetchLocations = () => {
      setLoading(true);

      // Sample data - in a real app, this would come from an API
      const sampleLocations: Location[] = [
        {
          id: 'loc1',
          name: 'Eiffel Tower',
          country: 'France',
          category: 'attraction',
          notes: 'Visit at sunset for best views',
          savedAt: new Date('2023-06-15'),
        },
        {
          id: 'loc2',
          name: 'Hotel Bella Vista',
          country: 'Italy',
          category: 'accommodation',
          notes: 'Beautiful views, great breakfast',
          savedAt: new Date('2023-07-22'),
        },
        {
          id: 'loc3',
          name: 'La Maison',
          country: 'France',
          category: 'restaurant',
          notes: 'Amazing French cuisine, make reservations',
          savedAt: new Date('2023-06-16'),
        },
        {
          id: 'loc4',
          name: 'Central Park',
          country: 'USA',
          category: 'attraction',
          notes: 'Great for running, boating, or relaxing',
          savedAt: new Date('2023-08-05'),
        },
        {
          id: 'loc5',
          name: 'Zen Spa',
          country: 'Thailand',
          category: 'other',
          notes: 'Best massage in Chiang Mai',
          savedAt: new Date('2023-08-12'),
        },
      ];

      setTimeout(() => {
        setSavedLocations(sampleLocations);
        setLoading(false);
      }, 800);
    };

    fetchLocations();
  }, []);

  const handleRemoveLocation = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSavedLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const handleLocationClick = (location: Location) => {
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  const filteredLocations = savedLocations
    .filter((location) => {
      // Filter by category
      if (filter !== 'all' && location.category !== filter) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          location.name.toLowerCase().includes(query) ||
          location.country.toLowerCase().includes(query) ||
          location.notes?.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime());

  const getCategoryColor = (category: Location['category']) => {
    switch (category) {
      case 'attraction':
        return 'bg-primary/10 text-primary';
      case 'accommodation':
        return 'bg-secondary/10 text-secondary';
      case 'restaurant':
        return 'bg-accent/10 text-accent';
      case 'other':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className={`saved-locations space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Saved Locations</h2>
        <Link href="/locations/add" className="btn btn-sm bg-primary text-white">
          <Plus className="mr-1 h-4 w-4" />
          Add Location
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search saved locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input w-full pl-9"
          />
        </div>

        <div className="flex">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-l-lg border px-3 py-2 text-sm font-medium ${
              filter === 'all' ? 'border-primary bg-primary text-white' : 'border-border bg-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('attraction')}
            className={`border-b border-t px-3 py-2 text-sm font-medium ${
              filter === 'attraction'
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white'
            }`}
          >
            Attractions
          </button>
          <button
            onClick={() => setFilter('accommodation')}
            className={`border-b border-t px-3 py-2 text-sm font-medium ${
              filter === 'accommodation'
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white'
            }`}
          >
            Hotels
          </button>
          <button
            onClick={() => setFilter('restaurant')}
            className={`rounded-r-lg border px-3 py-2 text-sm font-medium ${
              filter === 'restaurant'
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white'
            }`}
          >
            Restaurants
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse overflow-hidden p-4">
              <div className="mb-2 h-6 w-2/3 rounded bg-muted/60"></div>
              <div className="mb-3 h-4 w-1/3 rounded bg-muted/60"></div>
              <div className="mb-2 h-4 w-full rounded bg-muted/60"></div>
              <div className="h-4 w-full rounded bg-muted/60"></div>
              <div className="mt-4 flex items-center justify-between">
                <div className="h-6 w-1/4 rounded bg-muted/60"></div>
                <div className="h-8 w-8 rounded-full bg-muted/60"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredLocations.length === 0 ? (
        <div className="rounded-xl bg-muted/20 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
            <Heart className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">
            {searchQuery
              ? 'No locations match your search'
              : filter !== 'all'
                ? `No saved ${filter}s found`
                : 'No saved locations yet'}
          </h3>
          <p className="mx-auto mb-4 max-w-md text-muted-foreground">
            {searchQuery
              ? 'Try a different search term or category filter'
              : 'Save your favorite places to visit, stay, or eat during your trips.'}
          </p>
          <Link href="/explore" className="btn inline-flex bg-primary text-white">
            <Search className="mr-2 h-4 w-4" />
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              onClick={() => handleLocationClick(location)}
              className="card card-hover animate-fadeIn cursor-pointer overflow-hidden p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-1 text-lg font-semibold">{location.name}</h3>
                  <div className="mb-3 flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3.5 w-3.5 text-primary" />
                    <span>{location.country}</span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${getCategoryColor(location.category)}`}
                >
                  {location.category.charAt(0).toUpperCase() + location.category.slice(1)}
                </span>
              </div>

              {location.notes && (
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{location.notes}</p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Saved {new Date(location.savedAt).toLocaleDateString()}
                </span>
                <div className="flex items-center">
                  <button
                    onClick={(e) => handleRemoveLocation(location.id, e)}
                    className="mr-1 rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove from saved locations"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedLocations;
