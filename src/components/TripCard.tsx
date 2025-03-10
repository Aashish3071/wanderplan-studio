
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
    <div className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Trip Image */}
      <div className="aspect-[16/9] relative overflow-hidden">
        <img 
          src={trip.image} 
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">{trip.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              <span>{trip.location}</span>
              <span className="mx-2">•</span>
              <Clock size={14} className="mr-1" />
              <span>{trip.duration}</span>
            </div>
          </div>
          
          <button 
            onClick={handleLike}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
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
              className="w-7 h-7 rounded-full border border-border mr-2"
            />
            <span className="text-sm text-muted-foreground">
              by <span className="font-medium text-foreground">{trip.author.name}</span>
            </span>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <Heart size={14} className="mr-1" />
            <span>{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
