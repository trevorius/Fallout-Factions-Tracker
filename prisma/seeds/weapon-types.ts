import { PrismaClient } from "@prisma/client";

const weaponTypes = ["Melee", "Pistol", "Heavy Weapon", "Rifle", "Grenade"];

export async function seedWeaponTypes(prisma: PrismaClient) {
  console.log("Seeding weapon types...");
  for (const weaponType of weaponTypes) {
    try {
      await prisma.weaponType.upsert({
        where: { name: weaponType },
        update: {},
        create: {
          name: weaponType,
        },
      });
      console.log(`  Upserted weapon type: ${weaponType}`);
    } catch (e) {
      console.error(`Error seeding weapon type "${weaponType}":`, e);
    }
  }
  console.log("Weapon types seeding finished.");
}
