import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedOfficialData() {
  console.log("Seeding official data...");

  // TODO: Add upsert logic for official weapon data here

  console.log("Official data seeding complete.");
}

// Allow this script to be run directly
if (require.main === module) {
  seedOfficialData()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
