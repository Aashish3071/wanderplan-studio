import { AIProvider, TripGenerationPrompt, ActivitySuggestionPrompt } from '@/types/ai';
import { OpenAIProvider } from '@/lib/ai-providers/openai';
import { MockAIProvider } from '@/lib/ai-providers/mock';
import { Activity, ItineraryDay, Location, Place } from '@/types/itinerary';

// Initialize our chosen AI provider based on environment variables
function getAIProvider(): AIProvider {
  // Use mock provider if specified or if no OPENAI_API_KEY is available
  if (process.env.USE_MOCK_AI === 'true' || !process.env.OPENAI_API_KEY) {
    console.log('Using mock AI provider');
    return new MockAIProvider();
  }

  // Use OpenAI with GPT-4 if specified, otherwise use GPT-3.5-Turbo
  console.log('Using OpenAI provider');
  return new OpenAIProvider(
    process.env.OPENAI_USE_GPT4 === 'true' ? 'gpt-4-turbo-preview' : 'gpt-3.5-turbo'
  );
}

// Get the configured AI provider
const aiProvider = getAIProvider();

interface GenerateItineraryParams {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  interests: string[];
}

interface GenerateAlternativeParams {
  tripId: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  interests: string[];
  currentItinerary?: ItineraryDay[];
}

interface ReplacementSuggestionParams {
  tripId: string;
  dayId: string;
  date: string;
  destination: string;
  interests: string[];
  budget: string;
  excludedPlaceIds: string[];
}

/**
 * Generate a personalized itinerary based on user preferences
 */
export async function generateItinerary(params: TripGenerationPrompt): Promise<ItineraryDay[]> {
  try {
    // Call the AI provider to generate the itinerary
    const jsonResult = await aiProvider.generateItinerary(params);

    // Parse the JSON response
    const data = JSON.parse(jsonResult);

    // Return the parsed itinerary
    return data.days || [];
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
}

/**
 * Generates an alternative itinerary based on the current one
 */
export async function generateAlternativeItinerary(
  params: TripGenerationPrompt,
  currentItinerary?: ItineraryDay[]
): Promise<ItineraryDay[]> {
  try {
    // Convert the current itinerary to a JSON string if provided
    const currentItineraryJson = currentItinerary
      ? JSON.stringify({ days: currentItinerary })
      : '{}';

    // Call the AI provider to generate alternatives
    const jsonResult = await aiProvider.generateAlternatives(params, currentItineraryJson);

    // Parse the JSON response
    const data = JSON.parse(jsonResult);

    // Return the parsed itinerary
    return data.days || [];
  } catch (error) {
    console.error('Error generating alternative itinerary:', error);
    throw error;
  }
}

/**
 * Suggests a replacement activity when a user removes one
 */
export async function suggestReplacement(params: ActivitySuggestionPrompt): Promise<Activity> {
  try {
    // Call the AI provider to suggest a replacement
    const jsonResult = await aiProvider.suggestReplacement(params);

    // Parse the JSON response
    const activity = JSON.parse(jsonResult);

    return activity;
  } catch (error) {
    console.error('Error suggesting replacement activity:', error);
    throw error;
  }
}
