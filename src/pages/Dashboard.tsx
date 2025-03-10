
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ItineraryPlanner from '../components/ItineraryPlanner';
import BudgetTracker from '../components/BudgetTracker';
import { Calendar, Map, Globe, User, Download, Share2, Edit, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('itinerary');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Dashboard Header */}
        <section className="bg-secondary/50 py-10">
          <div className="container mx-auto container-padding">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    Trip Planning
                  </span>
                  <span className="text-muted-foreground text-sm">Dec 1 - Dec 10, 2023</span>
                </div>
                <h1 className="text-3xl font-display font-bold mt-2">Paris Getaway</h1>
                <p className="text-muted-foreground">Plan your dream trip to the City of Lights</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button className="btn-outline flex items-center text-sm py-2">
                  <Download size={16} className="mr-2" /> Export
                </button>
                <button className="btn-outline flex items-center text-sm py-2">
                  <Share2 size={16} className="mr-2" /> Share
                </button>
                <button className="btn-primary flex items-center text-sm py-2">
                  <Edit size={16} className="mr-2" /> Edit Trip
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-1 mt-8 border-b border-border">
              <button
                className={`px-4 py-2 font-medium text-sm relative ${
                  activeTab === 'itinerary' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('itinerary')}
              >
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Itinerary
                </div>
                {activeTab === 'itinerary' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </button>
              
              <button
                className={`px-4 py-2 font-medium text-sm relative ${
                  activeTab === 'budget' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('budget')}
              >
                <div className="flex items-center">
                  <Globe size={16} className="mr-2" />
                  Budget
                </div>
                {activeTab === 'budget' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </button>
              
              <button
                className={`px-4 py-2 font-medium text-sm relative ${
                  activeTab === 'map' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('map')}
              >
                <div className="flex items-center">
                  <Map size={16} className="mr-2" />
                  Map
                </div>
                {activeTab === 'map' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </button>
              
              <button
                className={`px-4 py-2 font-medium text-sm relative ${
                  activeTab === 'travelers' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('travelers')}
              >
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  Travelers
                </div>
                {activeTab === 'travelers' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </button>
            </div>
          </div>
        </section>
        
        {/* Dashboard Content */}
        <section className="py-10 container mx-auto container-padding">
          {activeTab === 'itinerary' && (
            <div className="space-y-8">
              <ItineraryPlanner />
              
              {/* Trip Highlights */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="font-display text-xl font-semibold mb-4">Trip Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-secondary/50 rounded-lg p-4 flex items-center space-x-4">
                    <img 
                      src="https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                      alt="Eiffel Tower"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium">Eiffel Tower</h3>
                      <p className="text-sm text-muted-foreground">Dec 1, 09:00</p>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 rounded-lg p-4 flex items-center space-x-4">
                    <img 
                      src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                      alt="Louvre Museum"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium">Louvre Museum</h3>
                      <p className="text-sm text-muted-foreground">Dec 1, 15:00</p>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 rounded-lg p-4 flex items-center space-x-4">
                    <img 
                      src="https://images.unsplash.com/photo-1561361058-c12e04bd9c4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                      alt="Notre-Dame"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium">Notre-Dame</h3>
                      <p className="text-sm text-muted-foreground">Dec 2, 10:00</p>
                    </div>
                  </div>
                </div>
                
                <button className="mt-4 flex items-center text-primary text-sm font-medium hover:underline">
                  <PlusCircle size={16} className="mr-2" /> Add Highlight
                </button>
              </div>
              
              {/* Local Insights */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display text-xl font-semibold">Local Insights</h2>
                  <Link to="/local-insights" className="text-primary text-sm font-medium hover:underline">
                    View All
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="p-4 bg-muted/30">
                      <h3 className="font-medium mb-2">Local Etiquette</h3>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                          Greet with "Bonjour" (hello) before starting conversation
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                          Dress neatly when visiting churches or nice restaurants
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                          Tipping is included in bills but rounding up is appreciated
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="p-4 bg-muted/30">
                      <h3 className="font-medium mb-2">Weather Forecast</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <div className="p-2 bg-white rounded-lg flex flex-col items-center">
                          <span className="text-xs text-muted-foreground">Dec 1</span>
                          <span className="text-lg">☀️</span>
                          <span className="font-medium">12°C</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg flex flex-col items-center">
                          <span className="text-xs text-muted-foreground">Dec 2</span>
                          <span className="text-lg">🌤️</span>
                          <span className="font-medium">10°C</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg flex flex-col items-center">
                          <span className="text-xs text-muted-foreground">Dec 3</span>
                          <span className="text-lg">🌧️</span>
                          <span className="font-medium">9°C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="p-4 bg-muted/30">
                      <h3 className="font-medium mb-2">Travel Advisories</h3>
                      <p className="text-sm text-green-600 mb-2 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                        No major travel advisories for Paris
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Standard precautions apply. Be aware of pickpocketing in tourist areas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'budget' && (
            <div>
              <BudgetTracker />
            </div>
          )}
          
          {activeTab === 'map' && (
            <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center h-80">
              <Globe size={48} className="text-muted-foreground mb-4" />
              <h3 className="font-display font-medium text-lg mb-2">Map View Coming Soon</h3>
              <p className="text-muted-foreground text-center max-w-md">
                We're working on integrating an interactive map to visualize your trip locations.
              </p>
            </div>
          )}
          
          {activeTab === 'travelers' && (
            <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center h-80">
              <User size={48} className="text-muted-foreground mb-4" />
              <h3 className="font-display font-medium text-lg mb-2">Traveler Management Coming Soon</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Soon you'll be able to add travel companions and manage group preferences.
              </p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
