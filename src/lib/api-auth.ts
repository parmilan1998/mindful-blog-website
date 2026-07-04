import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const WRITE_ROLES = ["ADMIN", "USER"] as const;
export type AppRole = (typeof WRITE_ROLES)[number] | "READER";

export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session, response: null as null };
}

export async function requireRole(roles: readonly string[] = WRITE_ROLES) {
  const { session, response } = await requireSession();
  if (response) return { session: null, response };

  const role = (session!.user as { role?: string }).role ?? "READER";

  if (!roles.includes(role)) {
    return {
      session: null,
      response: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { session, response: null as null };
}
