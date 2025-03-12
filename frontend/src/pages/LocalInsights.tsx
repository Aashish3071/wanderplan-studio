
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MapPin, CalendarDays, ThumbsUp, User, Search } from "lucide-react";

interface LocalInsight {
  id: number;
  city: string;
  category: string;
  content: string;
  author?: string;
  date: string;
  likes?: number;
  source?: string;
}

const LocalInsights = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in a real application, this would come from the API
  const mockInsights: LocalInsight[] = [
    {
      id: 1,
      city: 'Paris',
      category: 'Dining',
      content: 'Skip the tourist restaurants near major attractions. Instead, try Rue Cler for authentic Parisian cafes and markets.',
      author: 'Marie Dubois',
      date: '2023-10-15',
      likes: 42
    },
    {
      id: 2,
      city: 'Tokyo',
      category: 'Transportation',
      content: 'The Tokyo Metro passes are great, but consider getting a PASMO card for more flexibility with all transit systems.',
      author: 'Takashi Yamamoto',
      date: '2023-11-03',
      likes: 36
    },
    {
      id: 3,
      city: 'New York',
      category: 'Culture',
      content: 'Many museums have "pay what you wish" hours on Friday evenings. Check their websites for details.',
      author: 'Sarah Johnson',
      date: '2023-09-28',
      likes: 51
    },
    {
      id: 4,
      city: 'Rome',
      category: 'Sightseeing',
      content: 'To avoid the long lines at the Colosseum, buy your ticket at the Roman Forum entrance where lines are much shorter.',
      author: 'Marco Rossi',
      date: '2023-10-22',
      likes: 67
    },
    {
      id: 5,
      city: 'Dubai',
      category: 'Weather',
      content: 'Current temperature is 32°C with clear skies. Best time to visit outdoor attractions is early morning or evening.',
      source: 'Weather API',
      date: '2023-12-01'
    }
  ];

  const { data: insights = mockInsights, isLoading } = useQuery({
    queryKey: ['localInsights'],
    queryFn: async () => {
      try {
        // In a real app, this would fetch from your backend
        // const response = await axios.get('http://localhost:5000/api/insights');
        // return response.data;
        return mockInsights;
      } catch (error) {
        console.error("Error fetching insights:", error);
        return mockInsights;
      }
    }
  });

  const filteredInsights = insights.filter(insight => 
    insight.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    insight.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    insight.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderInsightCard = (insight: LocalInsight) => (
    <Card key={insight.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{insight.city}</span>
              <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                {insight.category}
              </span>
            </div>
            <CardTitle className="text-base">{insight.content}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            {insight.author ? (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{insight.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{insight.author}</span>
              </>
            ) : (
              <span>From {insight.source}</span>
            )}
            <span>•</span>
            <div className="flex items-center">
              <CalendarDays className="h-3 w-3 mr-1" />
              {insight.date}
            </div>
          </div>
          {insight.likes && (
            <div className="flex items-center">
              <ThumbsUp className="h-3 w-3 mr-1" />
              {insight.likes}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Local Insights</h1>
          <p className="text-muted-foreground">Discover insider tips and real-time information from locals and travelers</p>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by city, category, or keyword..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Insights</TabsTrigger>
            <TabsTrigger value="dining">Dining</TabsTrigger>
            <TabsTrigger value="transportation">Transportation</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="text-center py-10">Loading insights...</div>
            ) : filteredInsights.length > 0 ? (
              filteredInsights.map(renderInsightCard)
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No insights found matching your search criteria.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="dining">
            {isLoading ? (
              <div className="text-center py-10">Loading insights...</div>
            ) : filteredInsights.filter(i => i.category === 'Dining').length > 0 ? (
              filteredInsights.filter(i => i.category === 'Dining').map(renderInsightCard)
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No dining insights found.</p>
              </div>
            )}
          </TabsContent>
          
          {/* Similar TabsContent for other categories */}
          <TabsContent value="transportation">
            {isLoading ? (
              <div className="text-center py-10">Loading insights...</div>
            ) : filteredInsights.filter(i => i.category === 'Transportation').length > 0 ? (
              filteredInsights.filter(i => i.category === 'Transportation').map(renderInsightCard)
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No transportation insights found.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="culture">
            {isLoading ? (
              <div className="text-center py-10">Loading insights...</div>
            ) : filteredInsights.filter(i => i.category === 'Culture').length > 0 ? (
              filteredInsights.filter(i => i.category === 'Culture').map(renderInsightCard)
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No culture insights found.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="weather">
            {isLoading ? (
              <div className="text-center py-10">Loading insights...</div>
            ) : filteredInsights.filter(i => i.category === 'Weather').length > 0 ? (
              filteredInsights.filter(i => i.category === 'Weather').map(renderInsightCard)
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No weather insights found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default LocalInsights;
