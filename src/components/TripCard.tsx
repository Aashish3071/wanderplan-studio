
import { Clock, MapPin, User, Heart } from 'lucide-react';
import { useState } from 'react';

interface TripCardProps {
  trip: {
    id: string;
    title: string;
    location: string;
    duration: string;
    image: string;
    author: {
      name: string;
      avatar: string;
    };
    likes: number;
    isLiked?: boolean;
  };
}

const TripCard = ({ trip }: TripCardProps) => {
  const [isLiked, setIsLiked] = useState(trip.isLiked || false);
  const [likes, setLikes] = useState(trip.likes);
  
  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };
  
  return (
    <div className="neo-glass rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-primary/10">
      {/* Trip Image */}
      <div className="aspect-[16/9] relative overflow-hidden">
        <img 
          src={trip.image} 
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
        <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs text-white flex items-center">
          <Clock size={12} className="mr-1" />
          <span>{trip.duration}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground hover:text-primary transition-colors">{trip.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin size={14} className="mr-1 text-primary/70" />
              <span>{trip.location}</span>
            </div>
          </div>
          
          <button 
            onClick={handleLike}
            className="p-2 rounded-full hover:bg-primary/10 transition-colors"
          >
            <Heart 
              size={18} 
              className={isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} 
            />
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={trip.author.avatar} 
              alt={trip.author.name}
              className="w-8 h-8 rounded-full border-2 border-primary/20 mr-2"
            />
            <span className="text-sm text-muted-foreground">
              by <span className="font-medium text-foreground">{trip.author.name}</span>
            </span>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm bg-primary/10 px-2 py-1 rounded-full">
            <Heart size={14} className={isLiked ? 'mr-1 text-red-500' : 'mr-1 text-primary/70'} />
            <span>{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
