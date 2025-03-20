import fetch from 'node-fetch';
import * as fs from 'fs';

const BASE_URL = 'http://localhost:3000/api';
let authCookie = '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: any;
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  method = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  const options: any = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Cookie: authCookie,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  // If the response has a set-cookie header, store it
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    authCookie = setCookie;
  }

  try {
    return (await response.json()) as ApiResponse<T>;
  } catch (error) {
    return { success: false, error: 'Failed to parse JSON response' };
  }
}

interface Trip {
  id: string;
  title: string;
  description?: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  status: string;
  isPublic: boolean;
  coverImage?: string;
  budget?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface ItineraryDay {
  id: string;
  date: string;
  notes?: string;
  tripId: string;
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  type: string;
  cost?: number;
  transportType?: string;
  itineraryDayId: string;
  placeId?: string;
  locationId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Place {
  id: string;
  name: string;
  description?: string;
  type: string;
  address?: string;
  website?: string;
  phone?: string;
  openingHours?: string;
  priceRange?: string;
  rating?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  locationId?: string;
}

async function runTests() {
  console.log('Running API tests...');

  try {
    // Test trips endpoint
    console.log('\n--- Testing trips endpoint ---');
    const tripsResponse = await apiRequest<Trip[]>('/trips');
    console.log(`GET /trips status: ${tripsResponse.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Found ${tripsResponse.data?.length || 0} trips`);

    if (tripsResponse.data && tripsResponse.data.length > 0) {
      const tripId = tripsResponse.data[0].id;

      // Test single trip endpoint
      console.log('\n--- Testing single trip endpoint ---');
      const tripResponse = await apiRequest<Trip>(`/trips/${tripId}`);
      console.log(`GET /trips/${tripId} status: ${tripResponse.success ? 'SUCCESS' : 'FAILED'}`);

      // Test itinerary days endpoint
      console.log('\n--- Testing itinerary days endpoint ---');
      const daysResponse = await apiRequest<ItineraryDay[]>(`/itinerary/days?tripId=${tripId}`);
      console.log(
        `GET /itinerary/days?tripId=${tripId} status: ${daysResponse.success ? 'SUCCESS' : 'FAILED'}`
      );
      console.log(`Found ${daysResponse.data?.length || 0} itinerary days`);

      if (daysResponse.data && daysResponse.data.length > 0) {
        const dayId = daysResponse.data[0].id;

        // Test single itinerary day endpoint
        console.log('\n--- Testing single itinerary day endpoint ---');
        const dayResponse = await apiRequest<ItineraryDay>(`/itinerary/days/${dayId}`);
        console.log(
          `GET /itinerary/days/${dayId} status: ${dayResponse.success ? 'SUCCESS' : 'FAILED'}`
        );

        // Test activities endpoint
        console.log('\n--- Testing activities endpoint ---');
        const activitiesResponse = await apiRequest<Activity[]>(
          `/itinerary/activities?itineraryDayId=${dayId}`
        );
        console.log(
          `GET /itinerary/activities?itineraryDayId=${dayId} status: ${activitiesResponse.success ? 'SUCCESS' : 'FAILED'}`
        );
        console.log(`Found ${activitiesResponse.data?.length || 0} activities`);

        if (activitiesResponse.data && activitiesResponse.data.length > 0) {
          const activityId = activitiesResponse.data[0].id;

          // Test single activity endpoint
          console.log('\n--- Testing single activity endpoint ---');
          const activityResponse = await apiRequest<Activity>(
            `/itinerary/activities/${activityId}`
          );
          console.log(
            `GET /itinerary/activities/${activityId} status: ${activityResponse.success ? 'SUCCESS' : 'FAILED'}`
          );
        }
      }
    }

    // Test places endpoint
    console.log('\n--- Testing places endpoint ---');
    const placesResponse = await apiRequest<Place[]>('/places');
    console.log(`GET /places status: ${placesResponse.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Found ${placesResponse.data?.length || 0} places`);

    if (placesResponse.data && placesResponse.data.length > 0) {
      const placeId = placesResponse.data[0].id;

      // Test single place endpoint
      console.log('\n--- Testing single place endpoint ---');
      const placeResponse = await apiRequest<Place>(`/places/${placeId}`);
      console.log(`GET /places/${placeId} status: ${placeResponse.success ? 'SUCCESS' : 'FAILED'}`);
    }

    console.log('\nAll tests completed.');
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

runTests().catch(console.error);
