import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/db/queries";
import { supabase } from "@/lib/db/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch order",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes, finalPrice } = body;

    // Update order
    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (finalPrice !== undefined) updateData.final_price = finalPrice;

    const { data: order, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select("*, customers(*)")
      .single();

    if (error) throw error;

    // If status changed, add to history
    if (status) {
      await supabase.from("order_status_history").insert({
        order_id: id,
        status,
        notes: notes || null,
      });
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Order update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update order",
      },
      { status: 500 }
    );
  }
}
