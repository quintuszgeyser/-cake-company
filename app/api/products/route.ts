import { NextRequest, NextResponse } from "next/server";
import { getProducts, getFeaturedProducts, filterProducts } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minServings = searchParams.get("minServings");
    const dietary = searchParams.get("dietary");
    const search = searchParams.get("search");

    let products;

    // Check if any filters are applied
    if (category || minPrice || maxPrice || minServings || dietary || search) {
      products = await filterProducts({
        category: category || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minServings: minServings ? Number(minServings) : undefined,
        dietary: dietary || undefined,
        search: search || undefined,
      });
    } else if (featured === "true") {
      products = await getFeaturedProducts();
    } else {
      products = await getProducts();
    }

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
