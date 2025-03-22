/**
 * Interface for trip generation prompt parameters
 */
export interface TripGenerationPrompt {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  interests: string[];
  travelers: number;
}

/**
 * Interface for activity suggestion prompt
 */
export interface ActivitySuggestionPrompt {
  cityName: string;
  originalActivity: {
    title: string;
    description?: string;
    coordinates?: { lat: number; lng: number };
    time?: string;
  };
  interests: string[];
  budget: string;
}

/**
 * Interface that all AI providers must implement
 */
export interface AIProvider {
  generateItinerary(prompt: TripGenerationPrompt): Promise<string>;
  generateAlternatives(prompt: TripGenerationPrompt, currentItinerary: string): Promise<string>;
  suggestReplacement(prompt: ActivitySuggestionPrompt): Promise<string>;
}

/**
 * Factory function to get the configured AI provider
 */
export function getAIProvider(): AIProvider {
  // This will be replaced by the actual provider in ai-service.ts
  throw new Error('AI provider factory not implemented');
}
