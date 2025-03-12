
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TripCard from './TripCard';

const CommunityTripsSection = () => {
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

  return (
    <section className="section-padding container mx-auto container-padding bg-gradient-to-br from-background to-accent/20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">Community</span>
          <h2 className="text-3xl font-display font-bold mt-3 text-gradient-primary">Explore User Itineraries</h2>
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
  );
};

export default CommunityTripsSection;
