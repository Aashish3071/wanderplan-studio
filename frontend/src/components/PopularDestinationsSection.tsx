
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DestinationCard from './DestinationCard';

const PopularDestinationsSection = () => {
  // Sample data for popular destinations
  const popularDestinations = [
    {
      id: '1',
      name: 'Tokyo',
      location: 'Japan',
      image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Santorini',
      location: 'Greece',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.9,
      isFavorite: true,
    },
    {
      id: '3',
      name: 'Bali',
      location: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.7,
    },
    {
      id: '4',
      name: 'Paris',
      location: 'France',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.6,
    },
  ];

  return (
    <section className="section-padding container mx-auto container-padding bg-gradient-to-br from-accent/30 to-background">
      <div className="flex justify-between items-center mb-10">
        <div>
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">Discover</span>
          <h2 className="text-3xl font-display font-bold mt-3 text-gradient-primary">Popular Destinations</h2>
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
  );
};

export default PopularDestinationsSection;
