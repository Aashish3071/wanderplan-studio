
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, CloudRain, Thermometer, Wind, Umbrella, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface LocalInsight {
  id: number;
  city: string;
  category: string;
  content: string;
  source: string;
  lastUpdated: string;
}

const LocalInsights = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['localInsights', selectedCity],
    queryFn: async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/insights', {
          params: { city: selectedCity || undefined }
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching local insights:", error);
        return [];
      }
    }
  });
  
  const { data: weatherData, isLoading: isLoadingWeather } = useQuery({
    queryKey: ['weather', selectedCity],
    queryFn: async () => {
      if (!selectedCity) return null;
      
      try {
        const response = await axios.get(`http://localhost:5000/api/weather/${selectedCity}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
      }
    },
    enabled: !!selectedCity
  });
  
  const filteredInsights = insights.filter((insight: LocalInsight) => 
    insight.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    insight.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const weatherIcons: Record<string, JSX.Element> = {
    'Sunny': <div className="text-5xl">☀️</div>,
    'Partly cloudy': <div className="text-5xl">⛅</div>,
    'Cloudy': <div className="text-5xl">☁️</div>,
    'Rain': <div className="text-5xl">🌧️</div>,
    'Snow': <div className="text-5xl">❄️</div>,
    'Thunderstorm': <div className="text-5xl">⛈️</div>,
  };
  
  const getWeatherIcon = (condition: string) => {
    return weatherIcons[condition] || <div className="text-5xl">☀️</div>;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const popularCities = [
    'Paris', 'Tokyo', 'New York', 'Rome', 'Bangkok', 'London', 'Barcelona', 'Sydney'
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Local Insights & Weather</h1>
      
      <div className="mb-8 relative">
        <Input
          type="text"
          placeholder="Search for a city or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Popular Destinations</h2>
        <div className="flex flex-wrap gap-2">
          {popularCities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCity === city
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
      
      {selectedCity && (
        <Tabs defaultValue="weather" className="space-y-6">
          <TabsList>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="tips">Local Tips</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="transportation">Transportation</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weather">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Current Weather in {selectedCity}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingWeather ? (
                    <div className="text-center py-6">Loading weather data...</div>
                  ) : weatherData ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-4xl font-bold mb-2">{weatherData.current.temp_c}°C</div>
                        <div className="text-lg text-muted-foreground">{weatherData.current.condition.text}</div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                          <div className="flex items-center">
                            <Thermometer className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Feels like {weatherData.current.feelslike_c}°C</span>
                          </div>
                          <div className="flex items-center">
                            <Wind className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{weatherData.current.wind_kph} km/h</span>
                          </div>
                          <div className="flex items-center">
                            <CloudRain className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{weatherData.current.precip_mm} mm</span>
                          </div>
                          <div className="flex items-center">
                            <Umbrella className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{weatherData.current.humidity}% humidity</span>
                          </div>
                        </div>
                      </div>
                      {getWeatherIcon(weatherData.current.condition.text)}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No weather data available for {selectedCity}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingWeather ? (
                    <div className="text-center py-6">Loading forecast...</div>
                  ) : weatherData && weatherData.forecast ? (
                    <div className="space-y-4">
                      {weatherData.forecast.forecastday.map((day: any) => (
                        <div key={day.date} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className="text-sm text-muted-foreground">{day.day.condition.text}</div>
                          </div>
                          <div className="flex items-center">
                            <div className="text-sm mr-2">
                              {day.day.mintemp_c}°-{day.day.maxtemp_c}°C
                            </div>
                            {getWeatherIcon(day.day.condition.text)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No forecast data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tips">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInsights
                .filter((insight: LocalInsight) => insight.category === 'Local Tips')
                .map((insight: LocalInsight) => (
                  <Card key={insight.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{insight.city} Local Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{insight.content}</p>
                      <div className="text-sm text-muted-foreground mt-4">
                        <p>Source: {insight.source || 'Local Expert'}</p>
                        <p>Last updated: {formatDate(insight.lastUpdated)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {filteredInsights.filter((insight: LocalInsight) => insight.category === 'Local Tips').length === 0 && (
                <div className="col-span-2 text-center py-10 text-muted-foreground">
                  No local tips available for {selectedCity}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="safety">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInsights
                .filter((insight: LocalInsight) => insight.category === 'Safety')
                .map((insight: LocalInsight) => (
                  <Card key={insight.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        {insight.city} Safety Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{insight.content}</p>
                      <div className="text-sm text-muted-foreground mt-4">
                        <p>Source: {insight.source || 'Travel Advisory'}</p>
                        <p>Last updated: {formatDate(insight.lastUpdated)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {filteredInsights.filter((insight: LocalInsight) => insight.category === 'Safety').length === 0 && (
                <div className="col-span-2 text-center py-10 text-muted-foreground">
                  No safety information available for {selectedCity}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="transportation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInsights
                .filter((insight: LocalInsight) => insight.category === 'Transportation')
                .map((insight: LocalInsight) => (
                  <Card key={insight.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{insight.city} Transportation Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{insight.content}</p>
                      <div className="text-sm text-muted-foreground mt-4">
                        <p>Source: {insight.source || 'Local Transport Authority'}</p>
                        <p>Last updated: {formatDate(insight.lastUpdated)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {filteredInsights.filter((insight: LocalInsight) => insight.category === 'Transportation').length === 0 && (
                <div className="col-span-2 text-center py-10 text-muted-foreground">
                  No transportation information available for {selectedCity}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="food">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInsights
                .filter((insight: LocalInsight) => insight.category === 'Food')
                .map((insight: LocalInsight) => (
                  <Card key={insight.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{insight.city} Food Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{insight.content}</p>
                      <div className="text-sm text-muted-foreground mt-4">
                        <p>Source: {insight.source || 'Local Food Expert'}</p>
                        <p>Last updated: {formatDate(insight.lastUpdated)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {filteredInsights.filter((insight: LocalInsight) => insight.category === 'Food').length === 0 && (
                <div className="col-span-2 text-center py-10 text-muted-foreground">
                  No food guide available for {selectedCity}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      {!selectedCity && (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">Select a city to view local insights and weather information</p>
        </div>
      )}
    </div>
  );
};

export default LocalInsights;
