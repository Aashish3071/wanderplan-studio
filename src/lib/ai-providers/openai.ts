import OpenAI from 'openai';
import { AIProvider, TripGenerationPrompt, ActivitySuggestionPrompt } from '@/types/ai';
import { AIGeneratedItinerary, SimpleActivity } from '@/types/itinerary';

// Initialize the OpenAI client - will use environment variables automatically
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * OpenAI implementation of the AIProvider interface
 */
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-3.5-turbo') {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
    this.model = model;
  }

  /**
   * Generate a full trip itinerary based on user preferences
   */
  async generateItinerary(prompt: TripGenerationPrompt): Promise<string> {
    const systemPrompt = `You are a travel planning assistant. Create a detailed itinerary for a trip to ${prompt.destination} 
    from ${prompt.startDate} to ${prompt.endDate}. The traveler's interests include: ${prompt.interests.join(', ')}.
    Their budget level is: ${prompt.budget}. 
    
    Format your response as a valid JSON object with the following structure:
    {
      "summary": "Brief summary of the overall trip",
      "mapCenter": { "lat": latitude, "lng": longitude },
      "days": [
        {
          "day": 1,
          "date": "YYYY-MM-DD",
          "title": "Day title",
          "activities": [
            {
              "title": "Activity name",
              "description": "Detailed description",
              "location": "Location name",
              "coordinates": { "lat": latitude, "lng": longitude },
              "time": "start - end time",
              "cost": estimated cost as number,
              "imageUrl": "optional image URL"
            }
          ],
          "imageUrl": "optional image URL for the day"
        }
      ]
    }

    Provide real coordinates for each activity. Include at least 3-4 activities per day.
    `;

    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create an itinerary for my trip to ${prompt.destination}.` },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Failed to generate itinerary');
    }

    // Validate that the response is a valid JSON and has the correct structure
    try {
      const parsed = JSON.parse(content) as AIGeneratedItinerary;
      // Ensure we have required fields
      if (!parsed.summary || !parsed.mapCenter || !Array.isArray(parsed.days)) {
        throw new Error('Invalid AI response format');
      }
      return content;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to generate valid itinerary');
    }
  }

  /**
   * Generate alternative activities or days for an existing itinerary
   */
  async generateAlternatives(prompt: TripGenerationPrompt): Promise<string> {
    const systemPrompt = `You are a travel planning assistant. Create an alternative itinerary for a trip to ${prompt.destination} 
    from ${prompt.startDate} to ${prompt.endDate}. The traveler has already seen one option and wants something different.
    Their interests include: ${prompt.interests.join(', ')}. Their budget level is: ${prompt.budget}.
    
    Be creative and suggest different activities and locations compared to a standard itinerary.
    
    Format your response as a valid JSON object with the following structure:
    {
      "summary": "Brief summary of the overall trip",
      "mapCenter": { "lat": latitude, "lng": longitude },
      "days": [
        {
          "day": 1,
          "date": "YYYY-MM-DD",
          "title": "Day title",
          "activities": [
            {
              "title": "Activity name",
              "description": "Detailed description",
              "location": "Location name",
              "coordinates": { "lat": latitude, "lng": longitude },
              "time": "start - end time",
              "cost": estimated cost as number,
              "imageUrl": "optional image URL"
            }
          ],
          "imageUrl": "optional image URL for the day"
        }
      ]
    }

    Provide real coordinates for each activity. Include at least 3-4 activities per day.
    Offer unexpected and off-the-beaten-path experiences when possible.
    `;

    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.8, // Slightly higher temperature for more variety
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Create an alternative itinerary for my trip to ${prompt.destination}.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Failed to generate alternative itinerary');
    }

    return content;
  }

  /**
   * Suggest replacement activities based on user preferences
   */
  async suggestReplacement(prompt: ActivitySuggestionPrompt): Promise<string> {
    const systemPrompt = `You are a travel planning assistant. Suggest a replacement activity for a trip to ${prompt.cityName}.
    The original activity was: ${prompt.originalActivity.title} - ${prompt.originalActivity.description}.
    The traveler's interests include: ${prompt.interests.join(', ')}. Their budget level is: ${prompt.budget}.
    
    Format your response as a valid JSON object with the following structure:
    {
      "title": "Activity name",
      "description": "Detailed description",
      "location": "Location name",
      "coordinates": { "lat": latitude, "lng": longitude },
      "time": "start - end time",
      "cost": estimated cost as number,
      "imageUrl": "optional image URL"
    }
    
    Provide a real coordinate that's close to the original activity's location.
    Make the suggestion match the user's interests while being different from the original activity.
    `;

    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Suggest a replacement for ${prompt.originalActivity.title} in ${prompt.cityName}.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Failed to generate replacement activity');
    }

    // Validate that the response is a valid JSON and has the correct structure
    try {
      const parsed = JSON.parse(content) as SimpleActivity;
      // Ensure we have required fields
      if (!parsed.title || !parsed.description || !parsed.coordinates) {
        throw new Error('Invalid AI response format');
      }
      return content;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to generate valid replacement activity');
    }
  }
}
