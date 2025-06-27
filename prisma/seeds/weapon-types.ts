import { PrismaClient } from "@prisma/client";

const weaponTypes = ["Melee", "Pistol", "Heavy Weapon", "Rifle", "Grenade"];

export async function seedWeaponTypes(prisma: PrismaClient) {
  console.log("Seeding weapon types...");
  for (const typeName of weaponTypes) {
    await prisma.weaponType.upsert({
      where: { name: typeName },
      update: {},
      create: { name: typeName },
    });
    console.log(`  Upserted weapon type: ${typeName}`);
  }
  console.log("Weapon types seeded.");
}
