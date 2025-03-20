import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      itineraries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          destination: string;
          start_date: string;
          end_date: string;
          budget: number;
          current_spending: number;
          is_public: boolean;
          cover_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          destination: string;
          start_date: string;
          end_date: string;
          budget: number;
          current_spending?: number;
          is_public?: boolean;
          cover_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          destination?: string;
          start_date?: string;
          end_date?: string;
          budget?: number;
          current_spending?: number;
          is_public?: boolean;
          cover_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          itinerary_id: string;
          day_number: number;
          title: string;
          description: string | null;
          location: string;
          coordinates: [number, number] | null;
          start_time: string | null;
          end_time: string | null;
          type: 'morning' | 'afternoon' | 'evening';
          sub_type: 'meal' | 'sightseeing' | 'transport' | 'accommodation' | 'activity';
          cost: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          itinerary_id: string;
          day_number: number;
          title: string;
          description?: string | null;
          location: string;
          coordinates?: [number, number] | null;
          start_time?: string | null;
          end_time?: string | null;
          type: 'morning' | 'afternoon' | 'evening';
          sub_type: 'meal' | 'sightseeing' | 'transport' | 'accommodation' | 'activity';
          cost?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          itinerary_id?: string;
          day_number?: number;
          title?: string;
          description?: string | null;
          location?: string;
          coordinates?: [number, number] | null;
          start_time?: string | null;
          end_time?: string | null;
          type?: 'morning' | 'afternoon' | 'evening';
          sub_type?: 'meal' | 'sightseeing' | 'transport' | 'accommodation' | 'activity';
          cost?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      collaborations: {
        Row: {
          id: string;
          itinerary_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'viewer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          itinerary_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'viewer';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          itinerary_id?: string;
          user_id?: string;
          role?: 'owner' | 'editor' | 'viewer';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}; 