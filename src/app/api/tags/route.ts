import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";

// ─── Validation ───────────────────────────────────────────────────────────────

const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  slug: z.string().min(1, "Slug is required").max(80),
  description: z.string().max(300).optional().nullable(),
  color: z.string().optional(),
});

// ─── GET /api/tags ────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;

  const tags = await prisma.tag.findMany({
    where: {
      isDeleted: false,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
              { color: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return NextResponse.json({
    tags: tags.map((t: { _count: { posts: any } }) => ({
      ...t,
      postCount: t._count.posts,
      _count: undefined,
    })),
  });
}

// ─── POST /api/tags ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const json = await request.json();
  const parsed = createTagSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Guard slug collision
  const existing = await prisma.tag.findUnique({
    where: { slug: data.slug },
  });

  if (existing) {
    return NextResponse.json(
      { message: "A tag with this slug already exists" },
      { status: 409 },
    );
  }

  const tag = await prisma.tag.create({
    data: {
      name: data.name,
      slug: data.slug,
    },
  });

  return NextResponse.json({ success: true, tag }, { status: 201 });
}
