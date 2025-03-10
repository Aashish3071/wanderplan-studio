import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import DestinationCard from '../components/DestinationCard';
import TripCard from '../components/TripCard';
import { ArrowRight, Map, Clock, DollarSign, Users, Award, Sparkles } from 'lucide-react';

const Index = () => {
  // Sample data for popular destinations
  const popularDestinations = [
    {
      id: '1',
      name: 'Tokyo',
      location: 'Japan',
      image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.8,
      price: '$1,200',
    },
    {
      id: '2',
      name: 'Santorini',
      location: 'Greece',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.9,
      price: '$1,500',
      isFavorite: true,
    },
    {
      id: '3',
      name: 'Bali',
      location: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.7,
      price: '$950',
    },
    {
      id: '4',
      name: 'Paris',
      location: 'France',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.6,
      price: '$1,100',
    },
  ];
  
  // Sample data for community trips
  const communityTrips = [
    {
      id: '1',
      title: 'Exploring the Hidden Gems of Kyoto',
      location: 'Kyoto, Japan',
      duration: '7 days',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Emily Chen',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      likes: 124,
    },
    {
      id: '2',
      title: 'Italian Adventure: Rome to Amalfi Coast',
      location: 'Italy',
      duration: '10 days',
      image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Marco Rossi',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      likes: 86,
      isLiked: true,
    },
    {
      id: '3',
      title: 'Safari and Beaches: Tanzania Adventure',
      location: 'Tanzania',
      duration: '12 days',
      image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      },
      likes: 213,
    },
  ];
  
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Itineraries',
      description: 'Get personalized itineraries based on your preferences, budget, and travel style.',
    },
    {
      icon: Clock,
      title: 'Save Time Planning',
      description: 'Create comprehensive travel plans in minutes instead of hours or days.',
    },
    {
      icon: DollarSign,
      title: 'Smart Budget Tracking',
      description: 'Track expenses and get alerts when you\'re approaching your budget limits.',
    },
    {
      icon: Users,
      title: 'Collaborate with Friends',
      description: 'Plan trips together with friends and family in real-time.',
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Popular Destinations */}
        <section className="section-padding container mx-auto container-padding">
          <div className="flex justify-between items-center mb-10">
            <div>
              <span className="text-primary text-sm font-medium">Discover</span>
              <h2 className="text-3xl font-display font-bold mt-1">Popular Destinations</h2>
            </div>
            <Link to="/destinations" className="flex items-center text-primary font-medium hover:underline">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto container-padding">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary text-sm font-medium">Why Choose TripGenius</span>
              <h2 className="text-3xl font-display font-bold mt-1 mb-4">Plan Your Perfect Trip with AI</h2>
              <p className="text-muted-foreground">
                Our AI-powered platform streamlines travel planning, helps you stay on budget, and provides personalized recommendations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/dashboard" className="btn-primary">
                Start Planning
              </Link>
            </div>
          </div>
        </section>
        
        {/* Community Trips */}
        <section className="section-padding container mx-auto container-padding">
          <div className="flex justify-between items-center mb-10">
            <div>
              <span className="text-primary text-sm font-medium">Community</span>
              <h2 className="text-3xl font-display font-bold mt-1">Explore User Itineraries</h2>
            </div>
            <Link to="/community" className="flex items-center text-primary font-medium hover:underline">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communityTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-background z-0"></div>
          <div className="container mx-auto container-padding relative z-10">
            <div className="glass-card p-10 rounded-2xl text-center max-w-3xl mx-auto">
              <div className="bg-primary/20 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={32} />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">Ready for Your Next Adventure?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Create your TripGenius account today and start planning your dream vacation with the power of AI.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register" className="btn-primary">
                  Sign Up for Free
                </Link>
                <Link to="/how-it-works" className="btn-outline">
                  Learn How It Works
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
