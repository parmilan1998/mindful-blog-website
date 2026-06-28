import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const categories = [
  {
    name: "Technology",
    slug: "technology",
    description: "Tech news, tools, and software",
    order: 1,
  },
  {
    name: "Programming",
    slug: "programming",
    description: "Coding tutorials and best practices",
    order: 2,
  },
  {
    name: "AI & ML",
    slug: "ai-ml",
    description: "Artificial Intelligence and Machine Learning",
    order: 3,
  },
  {
    name: "Design",
    slug: "design",
    description: "UI/UX and product design",
    order: 4,
  },
];

export async function runCategorySeed() {
  console.log("📚 Running Category Seed...");

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });

    // ✅ IF EXISTS → DO NOTHING
    if (existing) {
      console.log(`⏭️ Already exists (skipped): ${cat.name}`);
      continue;
    }

    // ❌ ONLY CREATE IF NOT EXISTS
    const createdCategory = await prisma.category.create({
      data: {
        id: crypto.randomUUID(),
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        order: cat.order,
        status: "ACTIVE",
        isDeleted: false,
      },
    });

    console.log(`➕ Created category: ${cat.name}`);
    console.table({
      name: createdCategory.name,
      slug: createdCategory.slug,
      description: createdCategory.description,
      order: createdCategory.order,
      status: createdCategory.status,
      isDeleted: createdCategory.isDeleted,
    });
  }

  console.log("🎉 Category seed completed");
}
