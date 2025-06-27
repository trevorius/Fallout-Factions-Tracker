import type { PrismaClient } from "@prisma/client";

export async function seedOfficialData(prisma: PrismaClient) {
  console.log("Seeding official data...");

  // TODO: Add upsert logic for official weapon data here

  console.log("Official data seeding complete.");
}
