import "dotenv/config";

import { runAdminSeed } from "./seeds/admin.seed";
import { runCategorySeed } from "./seeds/category.seed";
import { runTagSeed } from "./seeds/tag.seed";

async function runSeeds() {
  console.log("\n🚀 ================================");
  console.log("   ENTERPRISE SEED SYSTEM START");
  console.log("================================\n");

  try {
    console.log("👑 Running Admin Seed...");
    await runAdminSeed();

    console.log("\n--------------------------------\n");

    console.log("📚 Running Category Seed...");
    await runCategorySeed();

    console.log("\n--------------------------------\n");

    console.log("🏷️ Running Tag Seed...");
    await runTagSeed();

    console.log("\n--------------------------------\n");

    console.log("🎉 ALL SEEDS COMPLETED SUCCESSFULLY");
  } catch (error) {
    console.error("❌ SEED FAILED:", error);
    process.exit(1);
  }
}

runSeeds();
