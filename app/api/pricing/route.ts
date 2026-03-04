import { createClient } from "@/lib/db/supabase";
import { NextRequest, NextResponse } from "next/server";
import { PricingConfig } from "@/lib/utils/pricing";

/**
 * GET /api/pricing
 * Fetch the active pricing configuration
 */
export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("pricing_config")
      .select("*")
      .eq("active", true)
      .single();

    if (error) {
      console.error("Error fetching pricing config:", error);
      return NextResponse.json(
        { error: "Failed to fetch pricing configuration" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No active pricing configuration found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/pricing
 * Update the pricing configuration
 * TODO: Add admin authentication check in Phase 3
 */
export async function PATCH(request: NextRequest) {
  try {
    // TODO: Verify admin authentication when auth is implemented
    // const user = await getUser();
    // const isAdmin = await checkIsAdmin(user);
    // if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const supabase = createClient();

    // Validate pricing values
    const validatedData: Partial<PricingConfig> = {};

    if (body.base_price !== undefined) {
      if (body.base_price < 0) {
        return NextResponse.json(
          { error: "Base price must be non-negative" },
          { status: 400 }
        );
      }
      validatedData.base_price = Number(body.base_price);
    }

    if (body.price_per_serving !== undefined) {
      if (body.price_per_serving < 0) {
        return NextResponse.json(
          { error: "Price per serving must be non-negative" },
          { status: 400 }
        );
      }
      validatedData.price_per_serving = Number(body.price_per_serving);
    }

    if (body.price_per_tier !== undefined) {
      if (body.price_per_tier < 0) {
        return NextResponse.json(
          { error: "Price per tier must be non-negative" },
          { status: 400 }
        );
      }
      validatedData.price_per_tier = Number(body.price_per_tier);
    }

    if (body.vegan_surcharge !== undefined) {
      validatedData.vegan_surcharge = Number(body.vegan_surcharge);
    }

    if (body.gluten_free_surcharge !== undefined) {
      validatedData.gluten_free_surcharge = Number(body.gluten_free_surcharge);
    }

    if (body.dairy_free_surcharge !== undefined) {
      validatedData.dairy_free_surcharge = Number(body.dairy_free_surcharge);
    }

    if (body.nut_free_surcharge !== undefined) {
      validatedData.nut_free_surcharge = Number(body.nut_free_surcharge);
    }

    if (body.sugar_free_surcharge !== undefined) {
      validatedData.sugar_free_surcharge = Number(body.sugar_free_surcharge);
    }

    if (body.setup_fee !== undefined) {
      validatedData.setup_fee = Number(body.setup_fee);
    }

    if (body.rush_delivery_fee !== undefined) {
      validatedData.rush_delivery_fee = Number(body.rush_delivery_fee);
    }

    if (body.flavor_premiums !== undefined) {
      validatedData.flavor_premiums = body.flavor_premiums;
    }

    if (body.filling_premiums !== undefined) {
      validatedData.filling_premiums = body.filling_premiums;
    }

    if (body.notes !== undefined) {
      validatedData.notes = body.notes;
    }

    if (body.updated_by !== undefined) {
      validatedData.updated_by = body.updated_by;
    }

    // Update the active pricing config
    const { data, error } = await supabase
      .from("pricing_config")
      .update(validatedData)
      .eq("active", true)
      .select()
      .single();

    if (error) {
      console.error("Error updating pricing config:", error);
      return NextResponse.json(
        { error: "Failed to update pricing configuration" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pricing configuration updated successfully",
      data,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
