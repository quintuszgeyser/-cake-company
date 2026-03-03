import { Cake } from "@/types/cake";

// Mock cake data - will be replaced with database queries later
export const cakes: Cake[] = [
  {
    id: "1",
    slug: "chocolate-dream",
    name: "Chocolate Dream Cake",
    description: "Rich, decadent chocolate layers with smooth ganache frosting. Perfect for chocolate lovers. Made with premium Belgian chocolate and finished with chocolate curls.",
    price: 45.00,
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop"
    ],
    category: "birthday",
    servings: 12,
    flavors: ["Chocolate", "Dark Chocolate Ganache"],
    dietary: ["Vegetarian"],
    featured: true,
  },
  {
    id: "2",
    slug: "vanilla-elegance",
    name: "Vanilla Elegance",
    description: "Classic vanilla sponge with buttercream and fresh berries. Timeless and delicious. Light, fluffy, and perfect for any celebration.",
    price: 42.00,
    images: [
      "https://images.unsplash.com/photo-1588195538326-c5acd4ae8e44?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&h=600&fit=crop"
    ],
    category: "wedding",
    servings: 16,
    flavors: ["Vanilla", "Buttercream"],
    dietary: ["Vegetarian"],
    featured: true,
  },
  {
    id: "3",
    slug: "red-velvet-romance",
    name: "Red Velvet Romance",
    description: "Luxurious red velvet with cream cheese frosting. A crowd favorite with its stunning appearance and rich taste.",
    price: 48.00,
    images: [
      "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800&h=600&fit=crop"
    ],
    category: "birthday",
    servings: 14,
    flavors: ["Red Velvet", "Cream Cheese"],
    dietary: ["Vegetarian"],
    featured: true,
  },
  {
    id: "4",
    slug: "lemon-delight",
    name: "Lemon Delight",
    description: "Light and refreshing lemon cake with zesty frosting. Perfect for summer celebrations and tea parties.",
    price: 40.00,
    images: [
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=800&h=600&fit=crop"
    ],
    category: "custom",
    servings: 12,
    flavors: ["Lemon", "Lemon Buttercream"],
    dietary: ["Vegetarian"],
    featured: true,
  },
  {
    id: "5",
    slug: "strawberry-bliss",
    name: "Strawberry Bliss",
    description: "Fresh strawberries layered with vanilla cream. A fruity paradise that's as beautiful as it is delicious.",
    price: 46.00,
    images: [
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=800&h=600&fit=crop"
    ],
    category: "birthday",
    servings: 10,
    flavors: ["Vanilla", "Strawberry Cream"],
    dietary: ["Vegetarian"],
    featured: true,
  },
  {
    id: "6",
    slug: "caramel-sensation",
    name: "Caramel Sensation",
    description: "Moist caramel cake with salted caramel drizzle. Pure indulgence in every bite. Perfect for caramel enthusiasts.",
    price: 50.00,
    images: [
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop"
    ],
    category: "corporate",
    servings: 20,
    flavors: ["Caramel", "Salted Caramel"],
    dietary: ["Vegetarian"],
    featured: true,
  },
  {
    id: "7",
    slug: "triple-tier-wedding",
    name: "Triple Tier Wedding Cake",
    description: "Elegant three-tier wedding cake with pristine white frosting and delicate decorations. Customizable to your wedding theme.",
    price: 250.00,
    images: [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=800&h=600&fit=crop"
    ],
    category: "wedding",
    servings: 100,
    flavors: ["Vanilla", "Lemon", "Chocolate"],
    dietary: ["Vegetarian"],
    featured: false,
  },
  {
    id: "8",
    slug: "unicorn-dream",
    name: "Unicorn Dream Cake",
    description: "Magical unicorn-themed cake with rainbow layers and colorful decorations. Every child's dream come true!",
    price: 55.00,
    images: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1602351447937-745cb720612f?w=800&h=600&fit=crop"
    ],
    category: "birthday",
    servings: 16,
    flavors: ["Vanilla Rainbow Layers"],
    dietary: ["Vegetarian"],
    featured: false,
  },
  {
    id: "9",
    slug: "corporate-logo-cake",
    name: "Corporate Logo Cake",
    description: "Professional corporate cake with custom logo and branding. Perfect for company events and celebrations.",
    price: 120.00,
    images: [
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&h=600&fit=crop"
    ],
    category: "corporate",
    servings: 30,
    flavors: ["Chocolate", "Vanilla"],
    dietary: ["Vegetarian"],
    featured: false,
  },
  {
    id: "10",
    slug: "vegan-chocolate-delight",
    name: "Vegan Chocolate Delight",
    description: "100% vegan chocolate cake that doesn't compromise on taste. Rich, moist, and absolutely delicious.",
    price: 52.00,
    images: [
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop"
    ],
    category: "custom",
    servings: 12,
    flavors: ["Vegan Chocolate"],
    dietary: ["Vegan", "Dairy-Free"],
    featured: false,
  },
  {
    id: "11",
    slug: "gluten-free-carrot",
    name: "Gluten-Free Carrot Cake",
    description: "Delicious gluten-free carrot cake with cream cheese frosting. Perfect for those with dietary restrictions.",
    price: 48.00,
    images: [
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608532341909-c77e08cd8385?w=800&h=600&fit=crop"
    ],
    category: "custom",
    servings: 10,
    flavors: ["Carrot", "Cream Cheese"],
    dietary: ["Gluten-Free", "Vegetarian"],
    featured: false,
  },
  {
    id: "12",
    slug: "birthday-celebration",
    name: "Birthday Celebration Cake",
    description: "Classic birthday cake with colorful sprinkles and your custom message. Available in multiple flavors.",
    price: 38.00,
    images: [
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=600&fit=crop"
    ],
    category: "birthday",
    servings: 12,
    flavors: ["Vanilla", "Chocolate", "Strawberry"],
    dietary: ["Vegetarian"],
    featured: false,
  },
];

export function getCakeBySlug(slug: string): Cake | undefined {
  return cakes.find((cake) => cake.slug === slug);
}

export function getFeaturedCakes(): Cake[] {
  return cakes.filter((cake) => cake.featured);
}

export function filterCakes(filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minServings?: number;
  dietary?: string;
  search?: string;
}): Cake[] {
  return cakes.filter((cake) => {
    if (filters.category && filters.category !== "all" && cake.category !== filters.category) {
      return false;
    }
    if (filters.minPrice && cake.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && cake.price > filters.maxPrice) {
      return false;
    }
    if (filters.minServings && cake.servings < filters.minServings) {
      return false;
    }
    if (filters.dietary && !cake.dietary.includes(filters.dietary)) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        cake.name.toLowerCase().includes(searchLower) ||
        cake.description.toLowerCase().includes(searchLower) ||
        cake.flavors.some((f) => f.toLowerCase().includes(searchLower));
      if (!matchesSearch) {
        return false;
      }
    }
    return true;
  });
}
