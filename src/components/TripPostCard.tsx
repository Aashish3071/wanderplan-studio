
import { useState } from 'react';
import { Heart, MessageCircle, MapPin, Clock, Share, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
}

interface TripPostCardProps {
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
    description: string;
    tips?: string;
    likes: number;
    comments: Comment[];
    createdAt: string;
  };
  onLike: (tripId: string) => void;
  onAddComment: (tripId: string, comment: string) => void;
}

const TripPostCard = ({ trip, onLike, onAddComment }: TripPostCardProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleShare = () => {
    // In a real app, this would use the Web Share API or copy to clipboard
    navigator.clipboard.writeText(`Check out this trip: ${trip.title} in ${trip.location}`);
    toast({
      title: "Link copied!",
      description: "Share this amazing trip with your friends.",
      duration: 3000,
    });
  };

  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for helping keep our community safe.",
      duration: 3000,
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(trip.id, comment);
      setComment('');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={cn(
      "neo-glass rounded-xl overflow-hidden border border-primary/10 transition-all duration-300",
      isExpanded ? "scale-102 shadow-xl z-10" : "hover:shadow-xl hover:-translate-y-1"
    )}>
      {/* Trip Image */}
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={trip.image} 
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Location and duration badges */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
          <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs text-white flex items-center">
            <MapPin size={12} className="mr-1" />
            <span>{trip.location}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs text-white flex items-center">
            <Clock size={12} className="mr-1" />
            <span>{trip.duration}</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground hover:text-primary transition-colors">{trip.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              Posted on {formatDate(trip.createdAt)}
            </div>
          </div>
        </div>
        
        {/* Author info */}
        <div className="mt-4 flex items-center">
          <img 
            src={trip.author.avatar} 
            alt={trip.author.name}
            className="w-10 h-10 rounded-full border-2 border-primary/20 mr-3"
          />
          <span className="text-sm">
            by <span className="font-medium text-foreground">{trip.author.name}</span>
          </span>
        </div>
        
        {/* Description */}
        <div className="mt-4">
          <p className={cn(
            "text-muted-foreground", 
            isExpanded ? "" : "line-clamp-3"
          )}>
            {trip.description}
          </p>
          {trip.tips && isExpanded && (
            <div className="mt-3 p-3 bg-accent/30 rounded-lg">
              <p className="text-sm font-medium mb-1">✨ Travel Tips:</p>
              <p className="text-sm text-muted-foreground">{trip.tips}</p>
            </div>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary text-sm mt-2 hover:underline"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        </div>
        
        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onLike(trip.id)}
              className="flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart size={18} className="mr-1" />
              <span>{trip.likes}</span>
            </button>
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle size={18} className="mr-1" />
              <span>{trip.comments.length}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
              aria-label="Share this trip"
            >
              <Share size={16} />
            </button>
            <button
              onClick={handleReport}
              className="p-2 rounded-full hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
              aria-label="Report this trip"
            >
              <Flag size={16} />
            </button>
          </div>
        </div>
        
        {/* Comments section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="font-medium text-sm mb-3">Comments ({trip.comments.length})</h4>
            
            {/* Comment list */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
              {trip.comments.map(comment => (
                <div key={comment.id} className="flex items-start gap-3">
                  <img 
                    src={comment.avatar} 
                    alt={comment.author} 
                    className="w-8 h-8 rounded-full mt-1"
                  />
                  <div className="flex-1 p-3 bg-secondary/50 rounded-xl rounded-tl-none">
                    <p className="text-xs font-medium mb-1">{comment.author}</p>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                  </div>
                </div>
              ))}
              
              {trip.comments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
            
            {/* Comment form */}
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 px-3 py-2 bg-secondary/50 rounded-full focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
              <button 
                type="submit"
                className="px-3 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                disabled={!comment.trim()}
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPostCard;
