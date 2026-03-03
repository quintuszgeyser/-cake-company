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

export interface CakeFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minServings?: number;
  dietary?: string;
  search?: string;
}
