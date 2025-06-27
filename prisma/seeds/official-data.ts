import type { PrismaClient, SPECIAL } from "@prisma/client";
import { perksData, specialMap } from "./perk-data";

export async function seedOfficialData(prisma: PrismaClient) {
  console.log("Seeding official perk data...");

  for (const perkData of perksData) {
    const { requisite, ...data } = perkData;
    await prisma.perk.upsert({
      where: { name: data.name },
      create: {
        ...data,
        requisite: requisite
          ? {
              create: {
                special: specialMap[requisite.special],
                value: requisite.value,
              },
            }
          : undefined,
      },
      update: {
        ...data,
        requisite: requisite
          ? {
              upsert: {
                create: {
                  special: specialMap[requisite.special],
                  value: requisite.value,
                },
                update: {
                  special: specialMap[requisite.special],
                  value: requisite.value,
                },
              },
            }
          : undefined, // Note: This will not delete existing requisites on update
      },
    });
  }

  console.log("Official perk data seeding complete.");
}
