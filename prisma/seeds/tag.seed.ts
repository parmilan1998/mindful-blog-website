import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const tags = [
  {
    name: "react",
    slug: "react",
    color: "#61dafb",
    description: "React ecosystem",
  },
  {
    name: "nextjs",
    slug: "nextjs",
    color: "#000000",
    description: "Next.js framework",
  },
  {
    name: "typescript",
    slug: "typescript",
    color: "#3178c6",
    description: "Type-safe JavaScript",
  },
  {
    name: "javascript",
    slug: "javascript",
    color: "#f7df1e",
    description: "JavaScript language",
  },
  {
    name: "nodejs",
    slug: "nodejs",
    color: "#3c873a",
    description: "Node.js backend",
  },

  {
    name: "express",
    slug: "express",
    color: "#444444",
    description: "Express backend framework",
  },
  {
    name: "prisma",
    slug: "prisma",
    color: "#0c344b",
    description: "ORM for databases",
  },
  {
    name: "mongodb",
    slug: "mongodb",
    color: "#4db33d",
    description: "NoSQL database",
  },
  {
    name: "postgresql",
    slug: "postgresql",
    color: "#336791",
    description: "SQL database",
  },
  {
    name: "mysql",
    slug: "mysql",
    color: "#00758f",
    description: "Relational database",
  },

  {
    name: "tailwind",
    slug: "tailwind",
    color: "#38bdf8",
    description: "Tailwind CSS",
  },
  {
    name: "css",
    slug: "css",
    color: "#264de4",
    description: "Cascading Style Sheets",
  },
  {
    name: "html",
    slug: "html",
    color: "#e34c26",
    description: "Markup language",
  },
  {
    name: "ui-ux",
    slug: "ui-ux",
    color: "#8b5cf6",
    description: "UI/UX design",
  },
  {
    name: "design",
    slug: "design",
    color: "#ec4899",
    description: "Product design",
  },

  {
    name: "api",
    slug: "api",
    color: "#10b981",
    description: "API development",
  },
  {
    name: "rest-api",
    slug: "rest-api",
    color: "#059669",
    description: "REST architecture",
  },
  {
    name: "graphql",
    slug: "graphql",
    color: "#e535ab",
    description: "GraphQL API",
  },
  {
    name: "authentication",
    slug: "authentication",
    color: "#f43f5e",
    description: "Auth systems",
  },
  {
    name: "security",
    slug: "security",
    color: "#dc2626",
    description: "Web security",
  },

  {
    name: "devops",
    slug: "devops",
    color: "#0ea5e9",
    description: "CI/CD & infrastructure",
  },
  {
    name: "docker",
    slug: "docker",
    color: "#2496ed",
    description: "Containerization",
  },
  {
    name: "aws",
    slug: "aws",
    color: "#ff9900",
    description: "Amazon Web Services",
  },
  {
    name: "cloud",
    slug: "cloud",
    color: "#6366f1",
    description: "Cloud computing",
  },
  {
    name: "linux",
    slug: "linux",
    color: "#f97316",
    description: "Linux systems",
  },

  {
    name: "mobile",
    slug: "mobile",
    color: "#14b8a6",
    description: "Mobile development",
  },
  {
    name: "react-native",
    slug: "react-native",
    color: "#61dafb",
    description: "React Native apps",
  },
  {
    name: "flutter",
    slug: "flutter",
    color: "#02569b",
    description: "Flutter framework",
  },
  {
    name: "ai",
    slug: "ai",
    color: "#a855f7",
    description: "Artificial Intelligence",
  },
  {
    name: "machine-learning",
    slug: "machine-learning",
    color: "#7c3aed",
    description: "ML models",
  },
];

export async function runTagSeed() {
  console.log("🏷️ Running Tag Seed...");

  for (const tag of tags) {
    const existing = await prisma.tag.findUnique({
      where: { slug: tag.slug },
    });

    // ✅ skip if exists
    if (existing) {
      console.log(`⏭️ Already exists (skipped): ${tag.name}`);
      continue;
    }

    // ❌ create only if not exists
    const createdTag = await prisma.tag.create({
      data: {
        id: crypto.randomUUID(),
        name: tag.name,
        slug: tag.slug,
        color: tag.color,
        description: tag.description,
        isDeleted: false,
      },
    });

    console.log(`➕ Created tag: ${tag.name}`);

    console.table({
      name: createdTag.name,
      slug: createdTag.slug,
      color: createdTag.color,
      description: createdTag.description,
    });
  }

  console.log("🎉 Tag seed completed");
}
