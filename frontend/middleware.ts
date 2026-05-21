import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Protect all dashboard-related routes
  const protectedRoutes = ["/dashboard", "/history", "/contracts", "/analytics", "/settings", "/team", "/support"];
  const isProtected = protectedRoutes.some(r => req.nextUrl.pathname.startsWith(r));

  if (!isProtected) return res;

  try {
    const supabase = createServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch {
    // Supabase not configured — let through
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/history/:path*", "/contracts/:path*", "/analytics/:path*", "/settings/:path*", "/team/:path*", "/support/:path*"],
};
