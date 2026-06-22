import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  // This proxy is reserved for API requests under /api/proxy
  // Allow the request to continue to Next.js route handling.
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/proxy/:path*"],
};
