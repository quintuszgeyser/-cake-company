import { OrderFormValues } from "@/lib/validations";

/**
 * Pricing configuration interface matching the pricing_config database table
 */
export interface PricingConfig {
  id?: string;
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
  flavor_premiums: Record<string, number>;
  filling_premiums: Record<string, number>;
  active?: boolean;
  notes?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Calculate order price dynamically based on pricing configuration
 * This centralizes ALL pricing logic to ensure consistency between frontend and backend
 *
 * @param orderData - Partial or complete order form values
 * @param config - Pricing configuration from database
 * @returns Calculated price in ZAR
 */
export function calculateOrderPrice(
  orderData: Partial<OrderFormValues>,
  config: PricingConfig
): number {
  let price = config.base_price;

  // Servings cost (linear per serving)
  if (orderData.servings) {
    price += orderData.servings * config.price_per_serving;
  }

  // Tiers cost (first tier included in base, additional tiers cost extra)
  if (orderData.tiers && orderData.tiers > 1) {
    price += (orderData.tiers - 1) * config.price_per_tier;
  }

  // Dietary surcharges
  if (orderData.dietary && orderData.dietary.length > 0) {
    const dietarySet = new Set(orderData.dietary);

    if (dietarySet.has("Vegan")) {
      price += config.vegan_surcharge;
    }
    if (dietarySet.has("Gluten-Free")) {
      price += config.gluten_free_surcharge;
    }
    if (dietarySet.has("Dairy-Free")) {
      price += config.dairy_free_surcharge;
    }
    if (dietarySet.has("Nut-Free")) {
      price += config.nut_free_surcharge;
    }
    if (dietarySet.has("Sugar-Free")) {
      price += config.sugar_free_surcharge;
    }
  }

  // Flavor premiums
  if (orderData.flavors && orderData.flavors.length > 0 && config.flavor_premiums) {
    orderData.flavors.forEach((flavor) => {
      const premium = config.flavor_premiums[flavor];
      if (premium) {
        price += premium;
      }
    });
  }

  // Filling premium
  if (orderData.filling && config.filling_premiums) {
    const premium = config.filling_premiums[orderData.filling];
    if (premium) {
      price += premium;
    }
  }

  // Setup fee
  if (orderData.setupRequired) {
    price += config.setup_fee;
  }

  // Round to 2 decimal places and ensure minimum price
  return Math.max(Math.round(price * 100) / 100, 20);
}

/**
 * Format price for display in South African Rands
 */
export function formatPrice(price: number): string {
  return `R ${price.toFixed(2)}`;
}

/**
 * Get price breakdown for display/debugging
 */
export function getPriceBreakdown(
  orderData: Partial<OrderFormValues>,
  config: PricingConfig
): Array<{ label: string; amount: number }> {
  const breakdown: Array<{ label: string; amount: number }> = [];

  breakdown.push({ label: "Base Price", amount: config.base_price });

  if (orderData.servings) {
    breakdown.push({
      label: `Servings (${orderData.servings} × R${config.price_per_serving})`,
      amount: orderData.servings * config.price_per_serving,
    });
  }

  if (orderData.tiers && orderData.tiers > 1) {
    breakdown.push({
      label: `Additional Tiers (${orderData.tiers - 1} × R${config.price_per_tier})`,
      amount: (orderData.tiers - 1) * config.price_per_tier,
    });
  }

  if (orderData.dietary && orderData.dietary.length > 0) {
    const dietarySet = new Set(orderData.dietary);
    if (dietarySet.has("Vegan")) {
      breakdown.push({ label: "Vegan Surcharge", amount: config.vegan_surcharge });
    }
    if (dietarySet.has("Gluten-Free")) {
      breakdown.push({ label: "Gluten-Free Surcharge", amount: config.gluten_free_surcharge });
    }
    if (dietarySet.has("Dairy-Free")) {
      breakdown.push({ label: "Dairy-Free Surcharge", amount: config.dairy_free_surcharge });
    }
    if (dietarySet.has("Nut-Free") && config.nut_free_surcharge > 0) {
      breakdown.push({ label: "Nut-Free Surcharge", amount: config.nut_free_surcharge });
    }
    if (dietarySet.has("Sugar-Free")) {
      breakdown.push({ label: "Sugar-Free Surcharge", amount: config.sugar_free_surcharge });
    }
  }

  if (orderData.flavors && orderData.flavors.length > 0 && config.flavor_premiums) {
    orderData.flavors.forEach((flavor) => {
      const premium = config.flavor_premiums[flavor];
      if (premium) {
        breakdown.push({ label: `${flavor} Premium`, amount: premium });
      }
    });
  }

  if (orderData.filling && config.filling_premiums) {
    const premium = config.filling_premiums[orderData.filling];
    if (premium) {
      breakdown.push({ label: `${orderData.filling} Premium`, amount: premium });
    }
  }

  if (orderData.setupRequired) {
    breakdown.push({ label: "Setup Fee", amount: config.setup_fee });
  }

  return breakdown;
}
