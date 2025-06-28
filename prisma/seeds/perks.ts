import { PrismaClient } from "@prisma/client";
import { perksData } from "./perk-data";

export async function seedPerks(prisma: PrismaClient) {
  console.log(`Seeding perks...`);
  for (const perk of perksData) {
    try {
      const existingPerk = await prisma.perk.findFirst({
        where: {
          name: perk.name,
        },
      });

      if (existingPerk) {
        continue;
      }

      await prisma.perk.create({
        data: {
          name: perk.name,
          description: perk.description,
          requisite: perk.requisite
            ? {
                create: {
                  special: perk.requisite.special as any,
                  value: perk.requisite.value,
                },
              }
            : undefined,
        },
      });
      console.log(`  Created perk: ${perk.name}`);
    } catch (e) {
      console.error(`Error creating perk "${perk.name}":`, e);
    }
  }
  console.log(`Seeding perks finished.`);
}
