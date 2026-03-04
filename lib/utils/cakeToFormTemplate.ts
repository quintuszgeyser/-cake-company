import { Cake, CakeTemplate } from "@/types/cake";
import { OrderFormValues } from "@/lib/validations";

/**
 * Maps a Cake or CakeTemplate to partial OrderFormValues for pre-filling the custom order form
 * If template_data exists (new templates), use it directly
 * Otherwise, fall back to inferring from legacy Cake fields
 */
export function cakeToFormTemplate(cake: Cake | CakeTemplate): Partial<OrderFormValues> {
  // If template has template_data, use it directly (new architecture)
  if ("template_data" in cake && cake.template_data) {
    return cake.template_data;
  }

  // Fallback for legacy cakes without template_data
  return {
    occasion: mapCategoryToOccasion(cake.category),
    cakeType: "round",
    servings: cake.servings,
    tiers: calculateTiers(cake.servings),
    flavors: extractFlavors(cake.flavors),
    filling: extractFilling(cake.flavors),
    designDescription: `Similar to ${cake.name} - ${cake.description}`,
    colorScheme: inferColorScheme(cake),
    dietary: cake.dietary || [],
    setupRequired: false,
  };
}

/**
 * Infers appropriate color scheme based on cake details
 */
function inferColorScheme(cake: Cake): string[] {
  // Map flavors/names to color suggestions
  const colorMap: Record<string, string[]> = {
    chocolate: ["white", "gold"],
    vanilla: ["white", "pink"],
    "red velvet": ["white", "red"],
    lemon: ["white", "gold"],
    strawberry: ["pink", "white"],
    caramel: ["gold", "white"],
    wedding: ["white", "gold"],
    corporate: ["white", "blue"],
  };

  const cakeLower = cake.name.toLowerCase();
  const categoryLower = cake.category.toLowerCase();

  // Try to match based on name or flavors
  for (const [key, colors] of Object.entries(colorMap)) {
    if (cakeLower.includes(key) || cake.flavors.some(f => f.toLowerCase().includes(key))) {
      return colors;
    }
  }

  // Fallback based on category
  if (colorMap[categoryLower]) {
    return colorMap[categoryLower];
  }

  // Default fallback
  return ["white"];
}

/**
 * Maps cake category to form occasion field
 */
function mapCategoryToOccasion(category: string): string {
  const map: Record<string, string> = {
    birthday: "birthday",
    wedding: "wedding",
    corporate: "corporate",
    custom: "other",
  };
  return map[category] || "other";
}

/**
 * Calculates appropriate number of tiers based on servings
 */
function calculateTiers(servings: number): number {
  if (servings < 20) return 1;
  if (servings < 50) return 2;
  if (servings < 100) return 3;
  return 4;
}

/**
 * Extracts primary cake flavors, filtering out descriptive words
 */
function extractFlavors(flavors: string[]): string[] {
  const baseFlavorMap: Record<string, string> = {
    "Chocolate": "Chocolate",
    "Dark Chocolate Ganache": "Chocolate",
    "Vanilla": "Vanilla",
    "Vanilla Rainbow Layers": "Vanilla",
    "Red Velvet": "Red Velvet",
    "Lemon": "Lemon",
    "Lemon Buttercream": "Lemon",
    "Strawberry": "Strawberry",
    "Strawberry Cream": "Strawberry",
    "Caramel": "Caramel",
    "Salted Caramel": "Caramel",
    "Vegan Chocolate": "Chocolate",
    "Carrot": "Carrot",
    "Coffee": "Coffee",
  };

  const extracted = flavors
    .map(f => baseFlavorMap[f] || f)
    .filter((v, i, a) => a.indexOf(v) === i);

  return extracted.length > 0 ? extracted : flavors.slice(0, 1);
}

/**
 * Detects filling from flavor descriptions
 */
function extractFilling(flavors: string[]): string | undefined {
  const fillingKeywords = [
    "Buttercream",
    "Cream Cheese",
    "Chocolate Ganache",
    "Fruit Jam",
    "Custard",
    "Whipped Cream",
    "Salted Caramel",
  ];

  for (const flavor of flavors) {
    for (const filling of fillingKeywords) {
      if (flavor.includes(filling)) {
        return filling;
      }
    }
  }

  return undefined;
}
