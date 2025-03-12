
import { useState } from 'react';
import axios from 'axios';
import { Clock, MapPin, Utensils, Hotel, Ticket, Car, Plus, Trash2 } from 'lucide-react';

interface ItineraryDay {
  id: number;
  date: string;
  activities: ItineraryActivity[];
}

interface ItineraryActivity {
  id: number;
  time: string;
  title: string;
  location: string;
  type: 'attraction' | 'food' | 'accommodation' | 'transport';
  cost?: number;
}

const ItineraryPlanner = () => {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    {
      id: 1,
      date: '2023-12-01',
      activities: [
        {
          id: 1,
          time: '09:00',
          title: 'Eiffel Tower',
          location: 'Champ de Mars, 5 Avenue',
          type: 'attraction',
          cost: 25,
        },
        {
          id: 2,
          time: '12:30',
          title: 'Lunch at Le Jules Verne',
          location: 'Eiffel Tower, 2nd floor',
          type: 'food',
          cost: 120,
        },
        {
          id: 3,
          time: '15:00',
          title: 'Louvre Museum',
          location: 'Rue de Rivoli, 75001',
          type: 'attraction',
          cost: 17,
        },
        {
          id: 4,
          time: '20:00',
          title: 'Hotel Check-in',
          location: 'Le Grand Paris Hotel',
          type: 'accommodation',
          cost: 200,
        },
      ],
    },
    {
      id: 2,
      date: '2023-12-02',
      activities: [
        {
          id: 5,
          time: '10:00',
          title: 'Notre-Dame Cathedral',
          location: '6 Parvis Notre-Dame',
          type: 'attraction',
          cost: 0,
        },
        {
          id: 6,
          time: '13:00',
          title: 'Seine River Cruise',
          location: 'Port de la Conférence',
          type: 'attraction',
          cost: 35,
        },
      ],
    },
  ]);

  const [activeDay, setActiveDay] = useState<number>(1);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attraction':
        return <Ticket size={16} />;
      case 'food':
        return <Utensils size={16} />;
      case 'accommodation':
        return <Hotel size={16} />;
      case 'transport':
        return <Car size={16} />;
      default:
        return <Ticket size={16} />;
    }
  };
  
  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'attraction':
        return 'bg-blue-100 text-blue-600';
      case 'food':
        return 'bg-orange-100 text-orange-600';
      case 'accommodation':
        return 'bg-purple-100 text-purple-600';
      case 'transport':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const generateItinerary = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/itineraries/generate', formData);
      setItinerary(response.data);
    } catch (error) {
      console.error('Error generating itinerary:', error);
    }
  };
  
  const handleAddActivity = (dayId: number) => {
    // Here you would implement logic to add a new activity
    console.log('Add activity to day:', dayId);
    // This would typically open a modal or form
  };
  
  const handleRemoveActivity = (dayId: number, activityId: number) => {
    setItinerary(prevItinerary => {
      return prevItinerary.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: day.activities.filter(activity => activity.id !== activityId)
          };
        }
        return day;
      });
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="rounded-xl glass-card p-6">
      <h2 className="font-display text-xl font-semibold mb-6">Trip Itinerary</h2>
      
      {/* Day tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-none">
        {itinerary.map((day) => (
          <button
            key={day.id}
            className={`flex-shrink-0 px-4 py-2 rounded-lg mr-2 transition-all ${
              activeDay === day.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
            onClick={() => setActiveDay(day.id)}
          >
            <span className="font-medium">{formatDate(day.date)}</span>
          </button>
        ))}
        <button className="flex-shrink-0 px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted flex items-center">
          <Plus size={16} className="mr-1" /> Add Day
        </button>
      </div>
      
      {/* Activities timeline */}
      <div className="space-y-4">
        {itinerary
          .find((day) => day.id === activeDay)
          ?.activities.map((activity) => (
            <div key={activity.id} className="relative pl-8 pb-5">
              {/* Timeline */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted"></div>
              <div className={`absolute left-1.5 top-1 w-4 h-4 rounded-full ${getActivityTypeColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              {/* Activity Card */}
              <div className="bg-white rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        <Clock size={14} className="inline mr-1" /> {activity.time}
                      </span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getActivityTypeColor(activity.type)} flex items-center`}>
                        {getActivityIcon(activity.type)}
                        <span className="ml-1">{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</span>
                      </span>
                    </div>
                    <h3 className="font-medium mt-1">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      <MapPin size={14} className="inline mr-1" /> {activity.location}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {activity.cost !== undefined && (
                      <span className="text-sm font-semibold">${activity.cost}</span>
                    )}
                    <button 
                      onClick={() => handleRemoveActivity(activeDay, activity.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
        {/* Add Activity Button */}
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 h-4 w-0.5 bg-muted"></div>
          <button 
            onClick={() => handleAddActivity(activeDay)}
            className="w-full bg-muted/30 hover:bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30 p-3 text-muted-foreground transition-colors flex items-center justify-center"
          >
            <Plus size={16} className="mr-2" /> Add Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPlanner;
