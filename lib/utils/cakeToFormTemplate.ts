import { Cake } from "@/types/cake";
import { OrderFormValues } from "@/lib/validations";

/**
 * Maps a Cake object to partial OrderFormValues for pre-filling the custom order form
 */
export function cakeToFormTemplate(cake: Cake): Partial<OrderFormValues> {
  return {
    occasion: mapCategoryToOccasion(cake.category),
    cakeType: "round",
    servings: cake.servings,
    tiers: calculateTiers(cake.servings),
    flavors: extractFlavors(cake.flavors),
    filling: extractFilling(cake.flavors),
    designDescription: `Similar to ${cake.name} - ${cake.description}`,
    colorScheme: [],
    dietary: cake.dietary || [],
    setupRequired: false,
  };
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
