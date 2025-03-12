
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Calendar, Users, MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import strapiService from "../services/strapiService";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Itinerary {
  id: number;
  title: string;
  destinations: string;
  dates: {
    from: string;
    to: string;
  };
  budget: number;
}

interface CommunityTrip {
  id: number;
  title: string;
  destination: string;
  author: string;
  likes: number;
}

const Dashboard = () => {
  const { data: itineraries = [], isLoading: isLoadingItineraries } = useQuery({
    queryKey: ['itineraries'],
    queryFn: async () => {
      try {
        // First try to fetch from Strapi
        const response = await strapiService.getItineraries();
        return response;
      } catch (error) {
        console.error("Error fetching itineraries from Strapi:", error);
        // Fallback to mock data if Strapi is not available
        return mockItineraries;
      }
    }
  });

  const { data: communityTrips = [], isLoading: isLoadingCommunity } = useQuery({
    queryKey: ['communityTrips'],
    queryFn: async () => {
      try {
        // First try to fetch from Strapi
        const response = await strapiService.getCommunityTrips();
        return response;
      } catch (error) {
        console.error("Error fetching community trips from Strapi:", error);
        // Fallback to mock data if Strapi is not available
        return mockCommunityTrips;
      }
    }
  });

  // Mock data for fallback
  const mockItineraries = [
    {
      id: 1,
      title: "Paris Adventure",
      destinations: "Paris, France",
      dates: {
        from: "2023-07-15",
        to: "2023-07-22"
      },
      budget: 1500
    },
    {
      id: 2,
      title: "Tokyo Exploration",
      destinations: "Tokyo, Japan",
      dates: {
        from: "2023-09-10",
        to: "2023-09-20"
      },
      budget: 2500
    },
    {
      id: 3,
      title: "Bali Retreat",
      destinations: "Bali, Indonesia",
      dates: {
        from: "2023-11-05",
        to: "2023-11-15"
      },
      budget: 1800
    }
  ];

  const mockCommunityTrips = [
    {
      id: 1,
      title: "European Backpacking",
      destination: "Multiple European Countries",
      author: "Jane Traveler",
      likes: 156
    },
    {
      id: 2,
      title: "Fjords of Norway",
      destination: "Norway",
      author: "Erik Adventurer",
      likes: 89
    },
    {
      id: 3,
      title: "South American Journey",
      destination: "Peru, Bolivia, Argentina",
      author: "Maria Explorer",
      likes: 124
    }
  ];

  const formatDateRange = (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <Link to="/plan-trip">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Plan New Trip
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="my-trips" className="space-y-4">
          <TabsList>
            <TabsTrigger value="my-trips">My Trips</TabsTrigger>
            <TabsTrigger value="saved">Saved Itineraries</TabsTrigger>
            <TabsTrigger value="community">Community Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-trips" className="space-y-4">
            {isLoadingItineraries ? (
              <div className="text-center py-10">Loading your trips...</div>
            ) : itineraries.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">You haven't created any trips yet</p>
                <Link to="/plan-trip">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Plan Your First Trip
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {itineraries.map((trip: Itinerary) => (
                  <Card key={trip.id}>
                    <CardHeader>
                      <CardTitle>{trip.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-1">
                          <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{trip.destinations}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{formatDateRange(trip.dates.from, trip.dates.to)}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        Budget: ${trip.budget}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/itinerary/${trip.id}`} className="w-full">
                        <Button variant="outline" className="w-full">View Details</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">You haven't saved any itineraries yet</p>
              <Link to="/community">
                <Button>
                  <Users className="mr-2 h-4 w-4" /> Explore Community Trips
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
            {isLoadingCommunity ? (
              <div className="text-center py-10">Loading community trips...</div>
            ) : communityTrips.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No community trips available</p>
                <Link to="/community">
                  <Button>
                    <Users className="mr-2 h-4 w-4" /> Explore Community
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {communityTrips.map((trip: CommunityTrip) => (
                  <Card key={trip.id}>
                    <CardHeader>
                      <CardTitle>{trip.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-1">
                          <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{trip.destination}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>By {trip.author}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        Likes: {trip.likes}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/community-trip/${trip.id}`} className="w-full">
                        <Button variant="outline" className="w-full">View Trip</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
