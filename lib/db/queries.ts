import { supabase } from "./supabase";

// Products/Cakes

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("available", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("available", true)
    .single();

  if (error) throw error;
  return data;
}

export async function filterProducts(filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minServings?: number;
  dietary?: string;
  search?: string;
}) {
  let query = supabase
    .from("products")
    .select("*")
    .eq("available", true);

  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters.minPrice) {
    query = query.gte("base_price", filters.minPrice);
  }

  if (filters.maxPrice) {
    query = query.lte("base_price", filters.maxPrice);
  }

  if (filters.minServings) {
    query = query.gte("servings", filters.minServings);
  }

  if (filters.dietary) {
    query = query.contains("dietary", [filters.dietary]);
  }

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Customers

export async function createOrUpdateCustomer(customerData: {
  name: string;
  email: string;
  phone: string;
}) {
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("*")
    .eq("email", customerData.email)
    .single();

  if (existingCustomer) {
    const { data, error } = await supabase
      .from("customers")
      .update({
        name: customerData.name,
        phone: customerData.phone,
      })
      .eq("id", existingCustomer.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("customers")
      .insert(customerData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

// Orders

export async function createOrder(orderData: any) {
  const { data: orderNumberData } = await supabase.rpc("generate_order_number");

  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumberData || `ORD-${Date.now()}`,
      customer_id: orderData.customer_id,
      occasion: orderData.occasion,
      cake_type: orderData.cakeType,
      servings: orderData.servings,
      tiers: orderData.tiers,
      flavors: orderData.flavors,
      filling: orderData.filling || null,
      design_description: orderData.designDescription,
      color_scheme: orderData.colorScheme,
      special_requests: orderData.specialRequests || null,
      dietary: orderData.dietary,
      allergens: orderData.allergens || null,
      delivery_date: orderData.deliveryDate,
      delivery_time: orderData.deliveryTime,
      delivery_address: orderData.deliveryAddress,
      setup_required: orderData.setupRequired,
      estimated_price: orderData.estimatedPrice || null,
      status: "pending",
      payment_status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrders(customerId?: string) {
  let query = supabase
    .from("orders")
    .select("*, customers(*)")
    .order("created_at", { ascending: false });

  if (customerId) {
    query = query.eq("customer_id", customerId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, customers(*)")
    .eq("id", orderId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;

  await supabase.from("order_status_history").insert({
    order_id: orderId,
    status,
  });

  return data;
}
