import { v4 as uuidv4 } from 'uuid';
import { AIProvider, TripGenerationPrompt, ActivitySuggestionPrompt } from '@/types/ai';
import { AIGeneratedItinerary, SimpleActivity, SimpleDay } from '@/types/itinerary';

/**
 * Mock implementation of the AIProvider interface for testing
 */
export class MockAIProvider implements AIProvider {
  /**
   * Generate a mock trip itinerary
   */
  generateItinerary = async (prompt: TripGenerationPrompt): Promise<string> => {
    const startDate = new Date(prompt.startDate);
    const endDate = new Date(prompt.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // For mock, create a center coordinate near the destination
    const mapCenter = this.getCoordinatesForCity(prompt.destination);
    
    const mockItinerary: AIGeneratedItinerary = {
      summary: `A ${diffDays}-day adventure in ${prompt.destination} exploring the best local sights, cuisine, and culture. This itinerary is tailored for ${prompt.interests.join(', ')} enthusiasts with a ${prompt.budget} budget.`,
      mapCenter,
      days: []
    };
    
    // Generate a day for each day of the trip
    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const activities: SimpleActivity[] = [];
      
      // Morning activity
      activities.push(this.generateMockActivity(
        `Morning exploration of ${prompt.destination}`, 
        mapCenter, 
        '09:00 - 11:30', 
        prompt.budget === 'budget' ? 0 : 25
      ));
      
      // Lunch
      activities.push(this.generateMockActivity(
        `Lunch at local restaurant`, 
        mapCenter, 
        '12:00 - 13:30', 
        prompt.budget === 'budget' ? 15 : 50
      ));
      
      // Afternoon activity
      activities.push(this.generateMockActivity(
        `Afternoon cultural visit`, 
        mapCenter, 
        '14:00 - 17:00', 
        prompt.budget === 'budget' ? 10 : 35
      ));
      
      // Dinner
      activities.push(this.generateMockActivity(
        `Dinner experience`, 
        mapCenter, 
        '19:00 - 21:00', 
        prompt.budget === 'budget' ? 20 : 75
      ));
      
      const day: SimpleDay = {
        day: i + 1,
        date: currentDate.toISOString().split('T')[0],
        title: i === 0 ? `Arrival and first day in ${prompt.destination}` : 
               i === diffDays - 1 ? `Final day in ${prompt.destination}` : 
               `Day ${i + 1} - Exploring ${prompt.destination}`,
        activities,
        imageUrl: `https://source.unsplash.com/random/800x600/?${prompt.destination},travel`
      };
      
      mockItinerary.days.push(day);
    }
    
    return JSON.stringify(mockItinerary);
  };
  
  /**
   * Generate mock alternative itinerary
   */
  generateAlternatives = async (prompt: TripGenerationPrompt): Promise<string> => {
  async generateItinerary(prompt: TripGenerationPrompt): Promise<string> {
    // Calculate number of days based on start and end dates
    const start = new Date(prompt.startDate);
    const end = new Date(prompt.endDate);
    const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Create a mock itinerary
    const mockItinerary = {
      summary: `A ${dayCount}-day trip to ${prompt.destination} focused on ${prompt.interests.slice(0, 2).join(' and ')}`,
      mapCenter: { lat: 40.7128, lng: -74.006 }, // Default to NYC coordinates
      days: Array.from({ length: dayCount }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);

        return {
          day: i + 1,
          date: date.toISOString().split('T')[0],
          title: `Day ${i + 1}: ${i === 0 ? 'Arrival' : i === dayCount - 1 ? 'Departure' : 'Exploration'}`,
          activities: [
            {
              title: 'Morning Activity',
              description: `Explore the ${prompt.interests[0] || 'local'} scene in ${prompt.destination}`,
              location: `${prompt.destination} Center`,
              coordinates: {
                lat: 40.7128 + Math.random() * 0.01,
                lng: -74.006 + Math.random() * 0.01,
              },
              time: '09:00 AM',
              cost: 25,
            },
            {
              title: 'Lunch',
              description: 'Enjoy a delicious local meal',
              location: `Restaurant in ${prompt.destination}`,
              coordinates: {
                lat: 40.7128 + Math.random() * 0.01,
                lng: -74.006 + Math.random() * 0.01,
              },
              time: '12:30 PM',
              cost: 30,
            },
            {
              title: 'Afternoon Activity',
              description: `Experience ${prompt.interests[1] || 'cultural'} activities`,
              location: `${prompt.destination} District`,
              coordinates: {
                lat: 40.7128 + Math.random() * 0.01,
                lng: -74.006 + Math.random() * 0.01,
              },
              time: '2:00 PM',
              cost: 40,
            },
            {
              title: 'Dinner',
              description: 'Savor the local cuisine at a top-rated restaurant',
              location: `${prompt.destination} Downtown`,
              coordinates: {
                lat: 40.7128 + Math.random() * 0.01,
                lng: -74.006 + Math.random() * 0.01,
              },
              time: '7:00 PM',
              cost: 50,
            },
          ],
        };
      }),
    };

    return JSON.stringify(mockItinerary);
  }

  /**
   * Generate mock alternative itinerary
   */
  async generateAlternatives(
    prompt: TripGenerationPrompt,
    currentItinerary: string
  ): Promise<string> {
    // Simply generate a new itinerary with slight modifications
    const baseItinerary = await this.generateItinerary(prompt);
    const parsedBase = JSON.parse(baseItinerary);

    // Slightly modify the activities
    const altItinerary = {
      ...parsedBase,
      summary: `Alternative ${parsedBase.summary}`,
      days: parsedBase.days.map((day: any) => ({
        ...day,
        activities: day.activities.map((activity: any) => ({
          ...activity,
          title: `Alternative: ${activity.title}`,
          description: `Different option for ${activity.description}`,
          cost: activity.cost + 5, // Slightly more expensive alternatives
        })),
      })),
    };

    return JSON.stringify(altItinerary);
  }

  /**
   * Generate a mock replacement activity
   */
  async suggestReplacement(prompt: ActivitySuggestionPrompt): Promise<string> {
    const mockActivity = {
      title: `Suggested ${prompt.interests[0] || 'Activity'}`,
      description: `A great alternative activity in ${prompt.destination} that matches your interest in ${prompt.interests.join(', ')}`,
      location: `${prompt.destination} Area`,
      coordinates: { lat: 40.7128 + Math.random() * 0.01, lng: -74.006 + Math.random() * 0.01 },
      time: '10:00 AM',
      cost: parseInt(prompt.budget) > 1000 ? 75 : 35,
    };

    return JSON.stringify(mockActivity);
  }
}
