import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db/supabase";
import { OrderFormValues } from "@/lib/validations";
import { calculateOrderPrice } from "@/lib/utils/pricing";

/**
 * POST /api/admin/templates
 * Create a new cake template
 * TODO: Add admin authentication check in Phase 3
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Verify admin authentication when auth is implemented
    // const user = await getUser();
    // const isAdmin = await checkIsAdmin(user);
    // if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.slug || !body.category || !body.template_data) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, category, template_data" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Fetch pricing config to calculate price
    const { data: pricingConfig, error: pricingError } = await supabase
      .from("pricing_config")
      .select("*")
      .eq("active", true)
      .single();

    if (pricingError || !pricingConfig) {
      return NextResponse.json(
        { error: "Failed to fetch pricing configuration" },
        { status: 500 }
      );
    }

    // Calculate price from template data
    const calculatedPrice = calculateOrderPrice(body.template_data, pricingConfig);

    // Extract key fields from template_data for easier querying
    const templateData: Partial<OrderFormValues> = body.template_data;

    // Insert template into products table
    const { data, error } = await supabase
      .from("products")
      .insert({
        slug: body.slug,
        name: body.name,
        description: body.description || "",
        base_price: calculatedPrice,
        images: body.images || [],
        category: body.category,
        servings: templateData.servings || 12,
        flavors: templateData.flavors || [],
        dietary: templateData.dietary || [],
        featured: body.featured || false,
        available: body.available !== false,
        template_data: body.template_data,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating template:", error);

      // Handle duplicate slug error
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A template with this slug already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Failed to create template" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template created successfully",
      template: data,
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/templates
 * List all templates (including non-available ones)
 * TODO: Add admin authentication check in Phase 3
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Verify admin authentication when auth is implemented

    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching templates:", error);
      return NextResponse.json(
        { error: "Failed to fetch templates" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      templates: data,
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/templates
 * Update an existing template
 * TODO: Add admin authentication check in Phase 3
 */
export async function PATCH(request: NextRequest) {
  try {
    // TODO: Verify admin authentication when auth is implemented

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // If template_data is being updated, recalculate price
    let updates: any = { ...body };
    delete updates.id; // Don't update the ID

    if (body.template_data) {
      // Fetch pricing config
      const { data: pricingConfig, error: pricingError } = await supabase
        .from("pricing_config")
        .select("*")
        .eq("active", true)
        .single();

      if (pricingError || !pricingConfig) {
        return NextResponse.json(
          { error: "Failed to fetch pricing configuration" },
          { status: 500 }
        );
      }

      // Recalculate price
      const calculatedPrice = calculateOrderPrice(body.template_data, pricingConfig);
      updates.base_price = calculatedPrice;

      // Update queryable fields from template_data
      if (body.template_data.servings) updates.servings = body.template_data.servings;
      if (body.template_data.flavors) updates.flavors = body.template_data.flavors;
      if (body.template_data.dietary) updates.dietary = body.template_data.dietary;
    }

    // Update template
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating template:", error);
      return NextResponse.json(
        { error: "Failed to update template" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template updated successfully",
      template: data,
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/templates
 * Delete a template
 * TODO: Add admin authentication check in Phase 3
 */
export async function DELETE(request: NextRequest) {
  try {
    // TODO: Verify admin authentication when auth is implemented

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting template:", error);
      return NextResponse.json(
        { error: "Failed to delete template" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
