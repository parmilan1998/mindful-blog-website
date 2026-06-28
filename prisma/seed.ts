import "dotenv/config";

import { runAdminSeed } from "./seeds/admin.seed";
import { runCategorySeed } from "./seeds/category.seed";

async function runSeeds() {
  console.log("\n🚀 ================================");
  console.log("   ENTERPRISE SEED SYSTEM START");
  console.log("================================\n");

  try {
    // 1. Admin seed (must run first)
    console.log("👑 Running Admin Seed...");
    await runAdminSeed();

    console.log("\n--------------------------------\n");

    // 2. Category seed
    console.log("📚 Running Category Seed...");
    await runCategorySeed();

    console.log("\n--------------------------------\n");

    console.log("🎉 ALL SEEDS COMPLETED SUCCESSFULLY");
  } catch (error) {
    console.error("❌ SEED FAILED:", error);
    process.exit(1);
  }
}

runSeeds();
