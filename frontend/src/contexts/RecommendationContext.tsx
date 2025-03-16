import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  recommendationApi,
  Itinerary,
  BudgetBreakdown,
  Activity,
  Accommodation,
} from "../services/api";

interface RecommendationContextType {
  generatedItinerary: Itinerary | null;
  budgetRecommendation: BudgetBreakdown | null;
  recommendedActivities: Activity[] | null;
  recommendedAccommodations: Accommodation[] | null;
  isLoading: boolean;
  error: string | null;
  generateItinerary: (tripParams: any) => Promise<Itinerary>;
  getBudgetRecommendation: (tripParams: any) => Promise<BudgetBreakdown>;
  refineItinerary: (
    itineraryId: string,
    refinementParams: any
  ) => Promise<Itinerary>;
  getActivityRecommendations: (params: any) => Promise<Activity[]>;
  getAccommodationRecommendations: (params: any) => Promise<Accommodation[]>;
  clearRecommendations: () => void;
}

const RecommendationContext = createContext<
  RecommendationContextType | undefined
>(undefined);

interface RecommendationProviderProps {
  children: ReactNode;
}

export const RecommendationProvider: React.FC<RecommendationProviderProps> = ({
  children,
}) => {
  const [generatedItinerary, setGeneratedItinerary] =
    useState<Itinerary | null>(null);
  const [budgetRecommendation, setBudgetRecommendation] =
    useState<BudgetBreakdown | null>(null);
  const [recommendedActivities, setRecommendedActivities] = useState<
    Activity[] | null
  >(null);
  const [recommendedAccommodations, setRecommendedAccommodations] = useState<
    Accommodation[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateItinerary = async (tripParams: any): Promise<Itinerary> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recommendationApi.generateItinerary(tripParams);
      const itinerary = response.data.data;
      setGeneratedItinerary(itinerary);
      return itinerary;
    } catch (err) {
      console.error("Failed to generate itinerary:", err);
      setError("Failed to generate itinerary. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getBudgetRecommendation = async (
    tripParams: any
  ): Promise<BudgetBreakdown> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recommendationApi.getBudgetRecommendation(
        tripParams
      );
      const budget = response.data.data;
      setBudgetRecommendation(budget);
      return budget;
    } catch (err) {
      console.error("Failed to get budget recommendation:", err);
      setError("Failed to get budget recommendation. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refineItinerary = async (
    itineraryId: string,
    refinementParams: any
  ): Promise<Itinerary> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recommendationApi.refineItinerary({
        itineraryId,
        ...refinementParams,
      });
      const refinedItinerary = response.data.data;
      setGeneratedItinerary(refinedItinerary);
      return refinedItinerary;
    } catch (err) {
      console.error("Failed to refine itinerary:", err);
      setError("Failed to refine itinerary. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityRecommendations = async (
    params: any
  ): Promise<Activity[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recommendationApi.getActivities(params);
      const activities = response.data.data;
      setRecommendedActivities(activities);
      return activities;
    } catch (err) {
      console.error("Failed to get activity recommendations:", err);
      setError(
        "Failed to get activity recommendations. Please try again later."
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAccommodationRecommendations = async (
    params: any
  ): Promise<Accommodation[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recommendationApi.getAccommodations(params);
      const accommodations = response.data.data;
      setRecommendedAccommodations(accommodations);
      return accommodations;
    } catch (err) {
      console.error("Failed to get accommodation recommendations:", err);
      setError(
        "Failed to get accommodation recommendations. Please try again later."
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearRecommendations = () => {
    setGeneratedItinerary(null);
    setBudgetRecommendation(null);
    setRecommendedActivities(null);
    setRecommendedAccommodations(null);
    setError(null);
  };

  return (
    <RecommendationContext.Provider
      value={{
        generatedItinerary,
        budgetRecommendation,
        recommendedActivities,
        recommendedAccommodations,
        isLoading,
        error,
        generateItinerary,
        getBudgetRecommendation,
        refineItinerary,
        getActivityRecommendations,
        getAccommodationRecommendations,
        clearRecommendations,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = (): RecommendationContextType => {
  const context = useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error(
      "useRecommendation must be used within a RecommendationProvider"
    );
  }
  return context;
};
