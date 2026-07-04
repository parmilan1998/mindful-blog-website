import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth";
import { requireRole } from "@/lib/api-auth";

const updateTagSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  slug: z.string().min(1).max(80).optional(),
  description: z.string().max(300).optional().nullable(),
  color: z.string().optional(),
});

// ─── GET /api/tags/:id ────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const tag = await prisma.tag.findUnique({
    where: { id, isDeleted: false },
    include: { _count: { select: { posts: true } } },
  });

  if (!tag) {
    return NextResponse.json({ message: "Tag not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...tag,
    postCount: tag._count.posts,
    _count: undefined,
  });
}

// ─── PATCH /api/tags/:id ──────────────────────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { id } = await params;

  const existing = await prisma.tag.findUnique({
    where: { id, isDeleted: false },
  });
  if (!existing) {
    return NextResponse.json({ message: "Tag not found" }, { status: 404 });
  }

  const json = await request.json();
  const parsed = updateTagSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  // Guard slug collision if slug is being changed
  if (parsed.data.slug && parsed.data.slug !== existing.slug) {
    const slugConflict = await prisma.tag.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (slugConflict) {
      return NextResponse.json(
        { message: "A tag with this slug already exists" },
        { status: 409 },
      );
    }
  }

  const tag = await prisma.tag.update({ where: { id }, data: parsed.data });

  return NextResponse.json({ success: true, tag });
}

// ─── DELETE /api/tags/:id ─────────────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response: authError } = await requireRole(["ADMIN"]);
  if (authError) return authError;

  const { id } = await params;

  const existing = await prisma.tag.findUnique({
    where: { id, isDeleted: false },
  });
  if (!existing) {
    return NextResponse.json({ message: "Tag not found" }, { status: 404 });
  }

  // Soft-delete; cascade removes PostTag rows automatically
  await prisma.tag.update({
    where: { id },
    data: { isDeleted: true },
  });

  return NextResponse.json({ success: true });
}
