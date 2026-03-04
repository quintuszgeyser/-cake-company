import { NextRequest, NextResponse } from "next/server";
import { createOrder, createOrUpdateCustomer } from "@/lib/db/queries";
import { orderFormSchema } from "@/lib/validations";
import { createClient } from "@/lib/db/supabase";
import { calculateOrderPrice } from "@/lib/utils/pricing";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the order data
    const validatedData = orderFormSchema.parse(body);

    // Fetch active pricing configuration
    const supabase = createClient();
    const { data: pricingConfig, error: pricingError } = await supabase
      .from("pricing_config")
      .select("*")
      .eq("active", true)
      .single();

    if (pricingError || !pricingConfig) {
      console.error("Failed to fetch pricing config:", pricingError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to calculate pricing. Please try again.",
        },
        { status: 500 }
      );
    }

    // Calculate estimated price using dynamic pricing engine
    const estimatedPrice = calculateOrderPrice(validatedData, pricingConfig);

    // Create or update customer
    const customer = await createOrUpdateCustomer({
      name: validatedData.customerName,
      email: validatedData.email,
      phone: validatedData.phone,
    });

    // Create order
    const order = await createOrder({
      ...validatedData,
      customer_id: customer.id,
      estimatedPrice,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        estimatedPrice: order.estimated_price,
      },
    });
  } catch (error: any) {
    console.error("Order creation error:", error);

    // Handle validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle database errors
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create order",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    // Note: In production, you'd verify authentication here
    // For now, this is just for testing

    const { getOrders } = await import("@/lib/db/queries");
    const orders = await getOrders(customerId || undefined);

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}
