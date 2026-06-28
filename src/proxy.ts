import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function proxy(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const pathname = new URL(req.url).pathname;

  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!session) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  const role = session?.user?.role;

  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isDashboardRoute && role !== "USER") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
