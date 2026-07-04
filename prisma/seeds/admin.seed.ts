import "dotenv/config";

import { auth } from "@/lib/auth";
import { PrismaClient, Role } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL is missing in .env");
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
  adapter,
});

export const runAdminSeed = async () => {
  if (!email || !password) {
    throw new Error("❌ ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (existingUser.role !== Role.ADMIN) {
      await prisma.user.update({
        where: { email },
        data: {
          role: Role.ADMIN,
          emailVerified: true,
        },
      });
    }

    console.log("✅ Admin already exists.");
    console.table({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    });
    return;
  }

  const newAdminUser = await auth.api.signUpEmail({
    body: {
      name: "Administrator",
      email,
      password,
    },
  });

  await prisma.user.update({
    where: { email },
    data: {
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  console.log("🎉 Admin created successfully.");
  console.table({
    id: newAdminUser.user.id,
    name: newAdminUser.user.name,
    email: newAdminUser.user.email,
    role: newAdminUser.user.role,
  });
};
