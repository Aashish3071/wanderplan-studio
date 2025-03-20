import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { PlusCircle, Filter, Grid, List, Search, MapPin, Calendar, User, Tag } from 'lucide-react';

export default function TripsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      // This redirects to the login page by default
    }
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample trip data
  const trips = [
    {
      id: '1',
      title: 'Paris Getaway',
      description: 'Exploring the beautiful city of Paris',
      startDate: '2023-06-10',
      endDate: '2023-06-17',
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80',
      status: 'PLANNING',
      collaborators: 2,
      locations: 5
    },
    {
      id: '2',
      title: 'Tokyo Adventure',
      description: 'Discovering the vibrant streets of Tokyo',
      startDate: '2023-07-15',
      endDate: '2023-07-25',
      coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80',
      status: 'CONFIRMED',
      collaborators: 1,
      locations: 8
    },
    {
      id: '3',
      title: 'New York City Trip',
      description: 'Experiencing the Big Apple',
      startDate: '2023-08-20',
      endDate: '2023-08-27',
      coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80',
      status: 'DRAFT',
      collaborators: 0,
      locations: 3
    }
  ];

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PLANNING': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'CANCELED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Head>
        <title>My Trips | WanderPlan Studio</title>
      </Head>

      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  My Trips
                </h1>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Link href="/trips/new" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Trip
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search trips..."
                className="bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <div className="bg-white rounded-md border border-gray-300 flex">
                <button
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Trip List */}
          {trips.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No trips</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new trip.</p>
              <div className="mt-6">
                <Link href="/trips/new" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                  New Trip
                </Link>
              </div>
            </div>
          ) : (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map((trip) => (
                  <Link key={trip.id} href={`/trips/${trip.id}`} className="block">
                    <div className="bg-white overflow-hidden shadow rounded-lg transition hover:shadow-md">
                      <div className="h-48 w-full relative">
                        <img
                          src={trip.coverImage}
                          alt={trip.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                            {trip.status}
                          </span>
                        </div>
                      </div>
                      <div className="px-4 py-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{trip.title}</h3>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{trip.description}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="mr-1 h-4 w-4 text-gray-400" />
                            {trip.collaborators} collaborators
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                            {trip.locations} places
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {trips.map((trip) => (
                    <li key={trip.id}>
                      <Link href={`/trips/${trip.id}`} className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                                <img
                                  src={trip.coverImage}
                                  alt={trip.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-blue-600 truncate">{trip.title}</p>
                                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                                    {trip.status}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                  <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <p>
                                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center text-sm text-gray-500">
                                  <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <p>{trip.collaborators}</p>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <p>{trip.locations}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
} 