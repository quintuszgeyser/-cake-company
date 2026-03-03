export interface OrderFormData {
  // Step 1: Cake Type
  occasion: string;
  cakeType: string;

  // Step 2: Size & Servings
  servings: number;
  tiers: number;

  // Step 3: Flavors
  flavors: string[];
  filling?: string;

  // Step 4: Design
  designDescription: string;
  colorScheme: string[];
  specialRequests?: string;
  referenceImages?: File[];

  // Step 5: Dietary & Details
  dietary: string[];
  allergens?: string;

  // Step 6: Delivery
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress: string;
  setupRequired: boolean;

  // Step 7: Contact
  customerName: string;
  email: string;
  phone: string;

  // Calculated
  estimatedPrice?: number;
}

export type OrderStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
