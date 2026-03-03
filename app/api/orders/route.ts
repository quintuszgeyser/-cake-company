import { NextRequest, NextResponse } from "next/server";
import { createOrder, createOrUpdateCustomer } from "@/lib/db/queries";
import { orderFormSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the order data
    const validatedData = orderFormSchema.parse(body);

    // Calculate estimated price
    let estimatedPrice = 50;
    estimatedPrice += (validatedData.servings / 10) * 15;
    estimatedPrice += (validatedData.tiers - 1) * 30;
    if (validatedData.dietary?.includes("Vegan") || validatedData.dietary?.includes("Gluten-Free")) {
      estimatedPrice += 15;
    }
    if (validatedData.setupRequired) {
      estimatedPrice += 25;
    }

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
      estimatedPrice: Math.round(estimatedPrice),
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
