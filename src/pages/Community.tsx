
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TripPostCard from '../components/TripPostCard';
import CreateTripPost from '../components/CreateTripPost';
import { Filter, Globe, MapPin, Search, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Community = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);

  // Sample data for community trips
  const [communityTrips, setCommunityTrips] = useState([
    {
      id: '1',
      title: 'Exploring the Hidden Gems of Kyoto',
      location: 'Kyoto, Japan',
      duration: '7 days',
      category: 'cultural',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Emily Chen',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      description: 'Discovered amazing shrines, beautiful gardens, and the best local restaurants in Kyoto. This was truly a trip to remember!',
      tips: 'Visit Fushimi Inari early in the morning to avoid crowds. Try the street food in Nishiki Market.',
      likes: 124,
      comments: [
        { id: '1', author: 'Mike', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', text: 'Thanks for sharing! I\'m planning a trip to Kyoto next month.' },
        { id: '2', author: 'Sara', avatar: 'https://randomuser.me/api/portraits/women/29.jpg', text: 'Did you visit Arashiyama Bamboo Grove? How was it?' }
      ],
      createdAt: '2023-10-15'
    },
    {
      id: '2',
      title: 'Italian Adventure: Rome to Amalfi Coast',
      location: 'Italy',
      duration: '10 days',
      category: 'adventure',
      image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Marco Rossi',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      description: 'From exploring the ancient ruins of Rome to relaxing on the beautiful beaches of Amalfi Coast, this trip had it all!',
      tips: 'Buy tickets for attractions in advance. Take the ferry from Naples to Positano for great views.',
      likes: 86,
      comments: [
        { id: '1', author: 'John', avatar: 'https://randomuser.me/api/portraits/men/42.jpg', text: 'The Amalfi Coast is on my bucket list. Looks amazing!' }
      ],
      createdAt: '2023-11-02'
    },
    {
      id: '3',
      title: 'Safari and Beaches: Tanzania Adventure',
      location: 'Tanzania',
      duration: '12 days',
      category: 'nature',
      image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      },
      description: 'Witnessed the great migration in Serengeti and relaxed on the pristine beaches of Zanzibar. An unforgettable experience!',
      tips: 'Pack light clothes but bring layers for early morning safaris. Don\'t forget a good camera with zoom lens!',
      likes: 213,
      comments: [
        { id: '1', author: 'David', avatar: 'https://randomuser.me/api/portraits/men/79.jpg', text: 'Did you see the big five?' },
        { id: '2', author: 'Emma', avatar: 'https://randomuser.me/api/portraits/women/39.jpg', text: 'I\'m going next year, any recommendations for guides?' },
        { id: '3', author: 'Kevin', avatar: 'https://randomuser.me/api/portraits/men/19.jpg', text: 'The photos look amazing! What camera did you use?' }
      ],
      createdAt: '2023-09-23'
    },
    {
      id: '4',
      title: 'Northern Lights Adventure in Iceland',
      location: 'Iceland',
      duration: '8 days',
      category: 'nature',
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Alex Thompson',
        avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      },
      description: 'Chasing the aurora borealis through Iceland\'s dramatic landscapes was magical. Hot springs, glaciers, and waterfalls made this trip perfect.',
      tips: 'Rent a 4x4 vehicle if visiting in winter. Download aurora forecast apps to maximize chances of seeing the lights.',
      likes: 157,
      comments: [
        { id: '1', author: 'Olivia', avatar: 'https://randomuser.me/api/portraits/women/51.jpg', text: 'When is the best time to see the Northern Lights?' }
      ],
      createdAt: '2023-12-05'
    },
  ]);

  const categories = [
    { id: 'all', name: 'All Experiences', icon: Globe },
    { id: 'adventure', name: 'Adventure', icon: MapPin },
    { id: 'cultural', name: 'Cultural', icon: Users },
    { id: 'nature', name: 'Nature', icon: MapPin },
  ];

  const handleAddTrip = (newTrip) => {
    setCommunityTrips([newTrip, ...communityTrips]);
    setShowForm(false);
    toast({
      title: "Trip shared successfully!",
      description: "Your experience has been shared with the community.",
    });
  };

  const filteredTrips = communityTrips.filter((trip) => {
    return (
      (selectedCategory === 'all' || trip.category === selectedCategory) &&
      (trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       trip.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
       trip.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleLike = (tripId) => {
    setCommunityTrips(
      communityTrips.map((trip) =>
        trip.id === tripId ? { ...trip, likes: trip.likes + 1 } : trip
      )
    );
  };

  const handleAddComment = (tripId, comment) => {
    setCommunityTrips(
      communityTrips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              comments: [
                ...trip.comments,
                {
                  id: Date.now().toString(),
                  author: 'You',
                  avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
                  text: comment,
                },
              ],
            }
          : trip
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero section for community */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary/20 to-accent/30 py-16">
          <div className="container mx-auto container-padding">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                <span className="text-gradient-primary">Travel Community</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Share your travel experiences, get inspired by others, and connect with fellow travelers from around the world.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-gradient"
              >
                Share Your Experience
              </button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20 -rotate-6">
            <Globe size={300} className="text-primary/40" />
          </div>
        </section>

        {/* Create post form */}
        {showForm && (
          <div className="py-8 container mx-auto container-padding">
            <div className="glass-card p-6 rounded-xl">
              <CreateTripPost onSubmit={handleAddTrip} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        )}

        {/* Search and filters */}
        <section className="py-8 container mx-auto container-padding">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search trips by destination, title, or description..."
                className="search-input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              <span className="flex items-center text-sm text-muted-foreground">
                <Filter size={16} className="mr-1" /> Filter:
              </span>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-secondary/70 text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Icon size={14} />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trip posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => (
                <TripPostCard
                  key={trip.id}
                  trip={trip}
                  onLike={handleLike}
                  onAddComment={handleAddComment}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="text-5xl mb-4">🏝️</div>
                <h3 className="text-xl font-semibold mb-2">No trips found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedCategory !== 'all'
                    ? "Try a different search term or filter"
                    : "Be the first to share your travel experience!"}
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 btn-primary"
                >
                  Share Your Experience
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Community;
