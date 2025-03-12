
import axios from 'axios';

// Base URL for Strapi API
const baseURL = 'http://localhost:1337/api';

// Create an axios instance with default headers
const strapiAPI = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the authorization token to requests when available
strapiAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('strapiToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Utility functions for working with Strapi
export const strapiService = {
  // Fetch itineraries
  getItineraries: async () => {
    try {
      const response = await strapiAPI.get('/itineraries');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      throw error;
    }
  },

  // Fetch a single itinerary by ID
  getItinerary: async (id: number) => {
    try {
      const response = await strapiAPI.get(`/itineraries/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching itinerary ${id}:`, error);
      throw error;
    }
  },

  // Create a new itinerary
  createItinerary: async (data: any) => {
    try {
      const response = await strapiAPI.post('/itineraries', { data });
      return response.data.data;
    } catch (error) {
      console.error('Error creating itinerary:', error);
      throw error;
    }
  },

  // Update an itinerary
  updateItinerary: async (id: number, data: any) => {
    try {
      const response = await strapiAPI.put(`/itineraries/${id}`, { data });
      return response.data.data;
    } catch (error) {
      console.error(`Error updating itinerary ${id}:`, error);
      throw error;
    }
  },

  // Fetch community trips
  getCommunityTrips: async () => {
    try {
      const response = await strapiAPI.get('/community-trips');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching community trips:', error);
      throw error;
    }
  },

  // Fetch local insights
  getLocalInsights: async () => {
    try {
      const response = await strapiAPI.get('/local-insights');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching local insights:', error);
      throw error;
    }
  },

  // Authentication functions
  login: async (identifier: string, password: string) => {
    try {
      const response = await axios.post(`${baseURL}/auth/local`, {
        identifier,
        password,
      });
      // Store the JWT token
      localStorage.setItem('strapiToken', response.data.jwt);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${baseURL}/auth/local/register`, {
        username,
        email,
        password,
      });
      // Store the JWT token
      localStorage.setItem('strapiToken', response.data.jwt);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('strapiToken');
    localStorage.removeItem('user');
  },

  // Check if the user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('strapiToken');
  },

  // Get the current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default strapiService;
