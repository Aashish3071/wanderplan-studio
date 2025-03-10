
import { useState } from 'react';
import { Image, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateTripPostProps {
  onSubmit: (trip: any) => void;
  onCancel: () => void;
}

const CreateTripPost = ({ onSubmit, onCancel }: CreateTripPostProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('adventure');
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState('');
  const [image, setImage] = useState('');

  // For demo purposes, we're not actually uploading images
  // Instead, we're using preset image URLs
  const demoImages = [
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  ];

  const handleImageSelect = (url) => {
    setImage(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !location || !duration || !description || !image) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select an image",
        variant: "destructive",
      });
      return;
    }
    
    // Create new trip object
    const newTrip = {
      id: Date.now().toString(),
      title,
      location,
      duration,
      category,
      description,
      tips,
      image,
      author: {
        name: 'You',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      },
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    onSubmit(newTrip);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">Share Your Trip</h2>
        <button 
          onClick={onCancel}
          className="rounded-full p-2 hover:bg-muted/50"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Trip Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Backpacking through Southeast Asia"
            className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
            required
          />
        </div>
        
        {/* Location and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="E.g., Thailand, Vietnam, Cambodia"
              className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium mb-1">
              Duration <span className="text-red-500">*</span>
            </label>
            <input
              id="duration"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="E.g., 2 weeks, 10 days"
              className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              required
            />
          </div>
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="adventure">Adventure</option>
            <option value="cultural">Cultural</option>
            <option value="nature">Nature</option>
            <option value="urban">Urban</option>
            <option value="beach">Beach</option>
            <option value="mountain">Mountain</option>
            <option value="food">Food & Culinary</option>
          </select>
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Share Your Experience <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your trip, the highlights, challenges, and memorable moments..."
            className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary min-h-[100px]"
            required
          />
        </div>
        
        {/* Tips */}
        <div>
          <label htmlFor="tips" className="block text-sm font-medium mb-1">
            Travel Tips (optional)
          </label>
          <textarea
            id="tips"
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder="Share useful advice for fellow travelers, e.g., best time to visit, local customs, transportation tips..."
            className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary min-h-[80px]"
          />
        </div>
        
        {/* Image Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Cover Image <span className="text-red-500">*</span>
          </label>
          
          {/* For demo purposes only, showing preset images to choose from */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {demoImages.map((imgUrl, index) => (
              <div 
                key={index}
                className={`aspect-video relative rounded-lg overflow-hidden cursor-pointer border-2 ${image === imgUrl ? 'border-primary' : 'border-transparent'}`}
                onClick={() => handleImageSelect(imgUrl)}
              >
                <img 
                  src={imgUrl} 
                  alt={`Option ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {image === imgUrl && (
                  <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                    <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                      ✓
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Image size={16} className="mr-1" />
            <span>Select a sample image for your post (in a real app, you would upload your own)</span>
          </div>
        </div>
        
        {/* Submit and Cancel buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 btn-gradient"
          >
            Share Your Trip
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTripPost;
