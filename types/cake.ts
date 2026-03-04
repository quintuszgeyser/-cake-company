import { OrderFormValues } from "@/lib/validations";

export interface Cake {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: "wedding" | "birthday" | "corporate" | "custom";
  servings: number;
  flavors: string[];
  dietary: string[];
  featured: boolean;
}

/**
 * CakeTemplate represents a saved custom order configuration that serves as a product
 * Templates store complete order form data and calculate prices dynamically
 */
export interface CakeTemplate {
  // Database fields
  id: string;
  slug: string;
  name: string;
  description: string;
  base_price: number; // Calculated price stored for display
  images: string[];
  category: "wedding" | "birthday" | "corporate" | "custom";
  servings: number;
  flavors: string[];
  dietary: string[];
  featured: boolean;
  available: boolean;

  // Template data (saved custom order configuration)
  template_data?: Partial<OrderFormValues>;

  // Metadata
  created_at?: string;
  updated_at?: string;
}

export interface CakeFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minServings?: number;
  dietary?: string;
  search?: string;
}
