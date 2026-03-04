import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

/**
 * Create a fresh Supabase client instance
 * Use this in API routes for proper auth handling
 */
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          base_price: number;
          images: string[];
          category: "birthday" | "wedding" | "corporate" | "custom";
          servings: number;
          flavors: string[];
          dietary: string[];
          featured: boolean;
          available: boolean;
          template_data: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      pricing_config: {
        Row: {
          id: string;
          base_price: number;
          price_per_serving: number;
          price_per_tier: number;
          vegan_surcharge: number;
          gluten_free_surcharge: number;
          dairy_free_surcharge: number;
          nut_free_surcharge: number;
          sugar_free_surcharge: number;
          setup_fee: number;
          rush_delivery_fee: number;
          flavor_premiums: any;
          filling_premiums: any;
          active: boolean;
          notes: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["pricing_config"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["pricing_config"]["Insert"]>;
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: "admin" | "baker" | "delivery";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_users"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["customers"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          occasion: string;
          cake_type: string;
          servings: number;
          tiers: number;
          flavors: string[];
          filling: string | null;
          design_description: string | null;
          color_scheme: string[];
          special_requests: string | null;
          dietary: string[];
          allergens: string | null;
          delivery_date: string;
          delivery_time: string;
          delivery_address: string;
          setup_required: boolean;
          estimated_price: number | null;
          final_price: number | null;
          status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
          payment_status: "pending" | "paid" | "refunded";
          payment_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "order_number" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          order_id: string | null;
          product_id: string | null;
          customer_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
    };
  };
}
