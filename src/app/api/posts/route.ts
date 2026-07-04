import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/api-auth";
import { estimateReadingTime } from "@/lib/utils";
import { PrismaClient } from "@/generated/prisma/client";

const POST_STATUSES = ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"] as const;

const createPostSchema = z
  .object({
    title: z.string().min(5),
    slug: z.string().min(3),
    excerpt: z.string().min(20).max(300),
    content: z.string().min(50),
    categoryId: z.string().min(1),
    authorId: z.string().min(1).optional(),
    status: z.enum(POST_STATUSES),
    isFeatured: z.boolean().default(false),
    isTrending: z.boolean().default(false),
    scheduledAt: z.string().optional().nullable(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    tagIds: z.array(z.string()).default([]),
    featuredImageUrl: z.string().url().optional().nullable(),
    featuredImageId: z.string().optional().nullable(),
  })
  .refine((data) => data.status !== "SCHEDULED" || Boolean(data.scheduledAt), {
    message: "scheduledAt is required when status is SCHEDULED",
    path: ["scheduledAt"],
  });

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Number(searchParams.get("pageSize") ?? "10"));

  const where = {
    ...(status
      ? { status: status.toUpperCase() as (typeof POST_STATUSES)[number] }
      : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { excerpt: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [posts, total] = await Promise.all([
    Prisma.post.findMany({
      where,
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    posts: posts.map((post) => ({
      ...post,
      tags: post.tags.map((t) => t.tag),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(request: NextRequest) {
  const { session, response: authError } = await requireRole();
  if (authError) return authError;

  const json = await request.json();
  const parsed = createPostSchema.safeParse(json);

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

  // Guard against a slug collision instead of letting the unique
  // constraint throw a raw 500.
  const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
  const slug = existing ? `${data.slug}-${Date.now().toString(36)}` : data.slug;

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      categoryId: data.categoryId,
      authorId: data.authorId ?? session!.user.id,
      status: data.status,
      isFeatured: data.isFeatured,
      isTrending: data.isTrending,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.excerpt,
      readingTime: estimateReadingTime(data.content),
      featuredImageUrl: data.featuredImageUrl ?? null,
      featuredImageId: data.featuredImageId ?? null,
      tags: {
        create: data.tagIds.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      },
    },
    include: {
      category: true,
      author: { select: { id: true, name: true, image: true } },
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(
    { success: true, post: { ...post, tags: post.tags.map((t) => t.tag) } },
    { status: 201 },
  );
}
