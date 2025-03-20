import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import type { User, Itinerary } from "@/types/database";

export function useSupabase() {
  const { data: session } = useSession();

  const getUserProfile = useCallback(async () => {
    if (!session?.user?.id) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single<User>();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return data;
  }, [session?.user?.id]);

  const updateUserProfile = useCallback(
    async (updates: Partial<User>) => {
      if (!session?.user?.id) return { error: new Error("No user session") };

      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", session.user.id)
        .select()
        .single<User>();

      if (error) {
        console.error("Error updating user profile:", error);
        return { error };
      }

      return { data };
    },
    [session?.user?.id]
  );

  const createItinerary = useCallback(
    async (itineraryData: Partial<Itinerary>) => {
      if (!session?.user?.id) return { error: new Error("No user session") };

      const { data, error } = await supabase
        .from("itineraries")
        .insert([{ ...itineraryData, user_id: session.user.id }])
        .select()
        .single<Itinerary>();

      if (error) {
        console.error("Error creating itinerary:", error);
        return { error };
      }

      return { data };
    },
    [session?.user?.id]
  );

  const getItineraries = useCallback(async () => {
    if (!session?.user?.id) return { error: new Error("No user session") };

    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .returns<Itinerary[]>();

    if (error) {
      console.error("Error fetching itineraries:", error);
      return { error };
    }

    return { data };
  }, [session?.user?.id]);

  return {
    getUserProfile,
    updateUserProfile,
    createItinerary,
    getItineraries,
  };
}
