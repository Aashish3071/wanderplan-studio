
import { useState } from 'react';
import { Search, Calendar, DollarSign, Compass } from 'lucide-react';

const Hero = () => {
  const [searchParams, setSearchParams] = useState({
    destination: '',
    dates: '',
    budget: '',
    interests: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search params:', searchParams);
    // Here you would trigger the search functionality
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white z-0"></div>
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl animate-spin-slow"></div>
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-accent rounded-full filter blur-3xl opacity-70 animate-spin-slow"></div>
      
      {/* Foreground Content */}
      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-slide-up">
          <span className="px-4 py-1.5 text-sm font-medium bg-accent text-primary rounded-full mb-6">
            AI-Powered Travel Planning
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Plan Your Dream Trip with <span className="text-primary">AI</span> Precision
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
            Create personalized itineraries, track your budget, and collaborate with friends—all in one intelligent travel platform.
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-muted-foreground" />
                </div>
                <input
                  type="text"
                  name="destination"
                  placeholder="Destination"
                  value={searchParams.destination}
                  onChange={handleChange}
                  className="search-input pl-10"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-muted-foreground" />
                </div>
                <input
                  type="text"
                  name="dates"
                  placeholder="Dates"
                  value={searchParams.dates}
                  onChange={handleChange}
                  className="search-input pl-10"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-muted-foreground" />
                </div>
                <input
                  type="text"
                  name="budget"
                  placeholder="Budget"
                  value={searchParams.budget}
                  onChange={handleChange}
                  className="search-input pl-10"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Compass size={18} className="text-muted-foreground" />
                </div>
                <input
                  type="text"
                  name="interests"
                  placeholder="Interests"
                  value={searchParams.interests}
                  onChange={handleChange}
                  className="search-input pl-10"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <button type="submit" className="btn-primary w-full md:w-auto">
                Plan My Trip
              </button>
            </div>
          </form>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>Popular: </span>
            {['Tokyo', 'Bali', 'Paris', 'New York', 'Santorini'].map((place) => (
              <button 
                key={place}
                onClick={() => setSearchParams(prev => ({ ...prev, destination: place }))}
                className="hover:text-primary hover:underline transition-colors"
              >
                {place}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-xs text-muted-foreground mb-2">Scroll to explore</span>
        <div className="w-0.5 h-6 bg-muted-foreground/30 rounded-full"></div>
      </div>
    </div>
  );
};

export default Hero;
