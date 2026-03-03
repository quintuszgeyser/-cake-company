import { z } from "zod";

export const orderFormSchema = z.object({
  // Step 1: Cake Type
  occasion: z.string().min(1, "Please select an occasion"),
  cakeType: z.string().min(1, "Please select a cake type"),

  // Step 2: Size & Servings
  servings: z.number().min(1, "Must serve at least 1 person").max(500, "Maximum 500 servings"),
  tiers: z.number().min(1, "Must have at least 1 tier").max(10, "Maximum 10 tiers"),

  // Step 3: Flavors
  flavors: z.array(z.string()).min(1, "Select at least one flavor"),
  filling: z.string().optional(),

  // Step 4: Design
  designDescription: z.string().min(10, "Please provide more details about your design (min 10 characters)"),
  colorScheme: z.array(z.string()).min(1, "Select at least one color"),
  specialRequests: z.string().optional(),

  // Step 5: Dietary
  dietary: z.array(z.string()),
  allergens: z.string().optional(),

  // Step 6: Delivery
  deliveryDate: z.string().min(1, "Please select a delivery date"),
  deliveryTime: z.string().min(1, "Please select a delivery time"),
  deliveryAddress: z.string().min(10, "Please provide a complete delivery address"),
  setupRequired: z.boolean(),

  // Step 7: Contact
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
