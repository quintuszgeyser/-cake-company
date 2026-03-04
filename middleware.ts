import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Not authenticated - redirect to login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Authenticated - verify admin status
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", user.email)
      .single();

    // Not an admin - redirect to home
    if (error || !adminUser) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Protect /api/admin routes
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    // Not authenticated
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - authentication required" },
        { status: 401 }
      );
    }

    // Verify admin status
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (error || !adminUser) {
      return NextResponse.json(
        { error: "Forbidden - admin privileges required" },
        { status: 403 }
      );
    }
  }

  // Protect PATCH /api/pricing (admin-only operation)
  if (
    request.nextUrl.pathname === "/api/pricing" &&
    request.method === "PATCH"
  ) {
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - authentication required" },
        { status: 401 }
      );
    }

    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (error || !adminUser) {
      return NextResponse.json(
        { error: "Forbidden - admin privileges required" },
        { status: 403 }
      );
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/pricing",
  ],
};
