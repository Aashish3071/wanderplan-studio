
import { useState } from 'react';
import { Heart, Star } from 'lucide-react';

interface DestinationCardProps {
  destination: {
    id: string;
    image: string;
    name: string;
    location: string;
    rating: number;
    price: string;
    isFavorite?: boolean;
  };
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  const [isFavorite, setIsFavorite] = useState(destination.isFavorite || false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with gradient overlay */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={destination.image} 
          alt={destination.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      {/* Favorite Button */}
      <button 
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors z-10"
      >
        <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} />
      </button>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display font-semibold text-lg">{destination.name}</h3>
            <p className="text-sm text-white/80">{destination.location}</p>
          </div>
          <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{destination.rating}</span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-white/20 flex justify-between items-center">
          <div>
            <span className="text-sm font-display">From</span>
            <span className="ml-1 font-display font-semibold">{destination.price}</span>
          </div>
          <button className="text-xs font-medium bg-white text-primary px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
