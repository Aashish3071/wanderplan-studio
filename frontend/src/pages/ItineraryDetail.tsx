
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Clock, DollarSign, Utensils, Hotel, Ticket, Car, Share2, Download, Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// You can import the existing ItineraryPlanner component for the timeline view
import ItineraryPlanner from "@/components/ItineraryPlanner";

interface Activity {
  id: number;
  time: string;
  title: string;
  location: string;
  type: 'attraction' | 'food' | 'accommodation' | 'transport';
  cost: number;
}

interface DailyPlan {
  id: number;
  date: string;
  activities: Activity[];
}

interface Itinerary {
  id: number;
  title: string;
  destinations: string;
  dates: {
    from: string;
    to: string;
  };
  budget: number;
  dailyPlan: DailyPlan[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'attraction':
      return <Ticket size={16} />;
    case 'food':
      return <Utensils size={16} />;
    case 'accommodation':
      return <Hotel size={16} />;
    case 'transport':
      return <Car size={16} />;
    default:
      return <Ticket size={16} />;
  }
};

const getActivityTypeColor = (type: string) => {
  switch (type) {
    case 'attraction':
      return 'bg-blue-100 text-blue-600';
    case 'food':
      return 'bg-orange-100 text-orange-600';
    case 'accommodation':
      return 'bg-purple-100 text-purple-600';
    case 'transport':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const ItineraryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [editMode, setEditMode] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  
  const { data: itinerary, isLoading } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/itineraries/${id}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching itinerary:", error);
        toast.error("Failed to load itinerary details");
        return null;
      }
    }
  });

  const calculateTotalCost = () => {
    if (!itinerary?.dailyPlan) return 0;
    
    return itinerary.dailyPlan.reduce((total, day) => {
      const dayTotal = day.activities.reduce((sum, activity) => sum + activity.cost, 0);
      return total + dayTotal;
    }, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleShareItinerary = () => {
    // In a real app, this would generate a shareable link
    toast.success("Shareable link copied to clipboard!");
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    toast.success("Itinerary PDF download started!");
  };

  if (isLoading) {
    return <div className="container mx-auto py-10 text-center">Loading itinerary details...</div>;
  }

  if (!itinerary) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Itinerary not found</h2>
        <Link to="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const totalBudget = itinerary.budget || 1000;
  const spentBudget = calculateTotalCost();
  const remainingBudget = totalBudget - spentBudget;
  const budgetPercentage = Math.min(100, (spentBudget / totalBudget) * 100);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{itinerary.title}</h1>
          <div className="flex items-center mt-2 text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{itinerary.destinations}</span>
            <span className="mx-2">•</span>
            <Calendar className="mr-1 h-4 w-4" />
            <span>
              {itinerary.dates?.from && itinerary.dates?.to 
                ? `${formatDate(itinerary.dates.from)} - ${formatDate(itinerary.dates.to)}`
                : 'Dates not specified'}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleShareItinerary}>
            <Share2 className="mr-1 h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="mr-1 h-4 w-4" /> Export PDF
          </Button>
          <Button size="sm" onClick={() => setEditMode(!editMode)}>
            <Edit className="mr-1 h-4 w-4" /> {editMode ? 'View Mode' : 'Edit Trip'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="itinerary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="insights">Local Insights</TabsTrigger>
          <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="itinerary">
          {itinerary.dailyPlan && itinerary.dailyPlan.length > 0 ? (
            <ItineraryPlanner />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Itinerary</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-10">
                <p className="text-muted-foreground mb-4">Your itinerary is being prepared</p>
                <Button onClick={() => setEditMode(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Start Adding Activities
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="budget">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Budget</span>
                    <span className="font-medium">${totalBudget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spent</span>
                    <span className="font-medium">${spentBudget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining</span>
                    <span className={`font-medium ${remainingBudget < 0 ? 'text-red-500' : ''}`}>
                      ${remainingBudget}
                    </span>
                  </div>
                  <Progress value={budgetPercentage} className="h-2" />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Expense Breakdown</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Hotel className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Accommodations</span>
                      </div>
                      <span>$400</span>
                    </div>
                    <Progress value={40} className="h-2 bg-purple-100" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Utensils className="mr-2 h-4 w-4 text-orange-500" />
                        <span>Food & Dining</span>
                      </div>
                      <span>$250</span>
                    </div>
                    <Progress value={25} className="h-2 bg-orange-100" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Ticket className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Activities & Attractions</span>
                      </div>
                      <span>$200</span>
                    </div>
                    <Progress value={20} className="h-2 bg-blue-100" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Car className="mr-2 h-4 w-4 text-green-500" />
                        <span>Transportation</span>
                      </div>
                      <span>$150</span>
                    </div>
                    <Progress value={15} className="h-2 bg-green-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cost-Saving Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-sm">
                  <li className="pb-2 border-b">
                    <p className="font-medium">Use public transport</p>
                    <p className="text-muted-foreground mt-1">Save $120 by using the metro instead of taxis</p>
                  </li>
                  <li className="pb-2 border-b">
                    <p className="font-medium">Museum pass</p>
                    <p className="text-muted-foreground mt-1">Buy a 3-day museum pass to save $45 on attraction fees</p>
                  </li>
                  <li className="pb-2 border-b">
                    <p className="font-medium">Local dining</p>
                    <p className="text-muted-foreground mt-1">Eat at local restaurants instead of tourist spots to save up to 30%</p>
                  </li>
                  <li>
                    <p className="font-medium">Free walking tours</p>
                    <p className="text-muted-foreground mt-1">Join free walking tours (tip-based) instead of paid guided tours</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Local Tips & Cultural Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="pb-3 border-b">
                  <h3 className="font-medium">Etiquette & Customs</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tipping is customary at restaurants (15-20%). Remove shoes when entering homes.
                  </p>
                </div>
                <div className="pb-3 border-b">
                  <h3 className="font-medium">Language Tips</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Learn basic phrases like "Hello" (Bonjour), "Thank you" (Merci), and "Excuse me" (Excusez-moi).
                  </p>
                </div>
                <div className="pb-3 border-b">
                  <h3 className="font-medium">Safety Information</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The area is generally safe. Be aware of pickpockets in tourist areas and keep valuables secure.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Local Secrets</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Visit the market on Tuesday mornings for the freshest local produce and authentic crafts.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Weather & Current Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <div>
                    <h3 className="font-medium">Current Weather</h3>
                    <p className="text-sm text-muted-foreground">Sunny, 24°C / 75°F</p>
                  </div>
                  <div className="text-5xl">☀️</div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Forecast During Your Trip</h3>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="space-y-1">
                      <div className="text-xl">☀️</div>
                      <div className="text-xs font-medium">Mon</div>
                      <div className="text-xs">23°C</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xl">⛅</div>
                      <div className="text-xs font-medium">Tue</div>
                      <div className="text-xs">21°C</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xl">🌧️</div>
                      <div className="text-xs font-medium">Wed</div>
                      <div className="text-xs">19°C</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xl">⛅</div>
                      <div className="text-xs font-medium">Thu</div>
                      <div className="text-xs">20°C</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xl">☀️</div>
                      <div className="text-xs font-medium">Fri</div>
                      <div className="text-xs">22°C</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h3 className="font-medium mb-2">Travel Advisories</h3>
                  <div className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p>Minor transportation disruption due to construction in the city center. Allow extra travel time.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="collaborate">
          <Card>
            <CardHeader>
              <CardTitle>Collaborate on this Trip</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Invite Travel Companions</h3>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <Button>Invite</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Activity Voting</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Let your travel companions vote on the activities they prefer
                </p>
                
                <div className="space-y-3">
                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Eiffel Tower Visit</span>
                      <span className="text-sm">3/4 votes</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Seine River Cruise</span>
                      <span className="text-sm">2/4 votes</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Louvre Museum</span>
                      <span className="text-sm">4/4 votes</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Comments</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Sarah</span>
                      <span className="text-xs text-muted-foreground">Yesterday, 3:24 PM</span>
                    </div>
                    <p className="text-sm">I'd love to spend more time at the Louvre, could we allocate 3 hours instead of 2?</p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Mike</span>
                      <span className="text-xs text-muted-foreground">Yesterday, 5:10 PM</span>
                    </div>
                    <p className="text-sm">The restaurant on day 2 looks expensive. Can we find a more budget-friendly option?</p>
                  </div>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <textarea 
                    placeholder="Add a comment..." 
                    className="flex-1 px-3 py-2 border rounded-md min-h-[80px]"
                  ></textarea>
                </div>
                <Button className="mt-2">Post Comment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ItineraryDetail;
