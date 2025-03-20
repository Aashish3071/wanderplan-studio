import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Calendar, MapPin, Clock, List, Grid, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PlanPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      // This redirects to the login page by default
    }
  });

  const [activeView, setActiveView] = useState('grid');

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Trip Planner | WanderPlan</title>
      </Head>

      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Trip Planner
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create Your Perfect Itinerary</h2>
            <p className="text-gray-600 mb-4">
              Use our trip planner to organize your days, add activities, and make the most of your travel time.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 hover:shadow-md transition-all">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Organize by Days</h3>
                <p className="text-sm text-gray-500 mt-2">Create a day-by-day itinerary for your trip</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 hover:shadow-md transition-all">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Add Places</h3>
                <p className="text-sm text-gray-500 mt-2">Find and add attractions, restaurants, and more</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 hover:shadow-md transition-all">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Set Times</h3>
                <p className="text-sm text-gray-500 mt-2">Schedule activities with precise timing</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Link href="/trips/new" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Start Planning
              </Link>
            </div>
          </div>
          
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a trip to start planning</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Go to your dashboard to select an existing trip or create a new one
            </p>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 