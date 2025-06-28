import { PrismaClient } from "@prisma/client";
import { seedOfficialData } from "./seeds/official-data";
import { seedSuperAdmin } from "./seeds/super-admin";
import { seedWeaponTraits } from "./seeds/weapon-traits";
import { seedCriticalEffects } from "./seeds/critical-effects";
import { seedOfficialWeapons } from "./seeds/official-weapons";
import { seedWeaponTypes } from "./seeds/weapon-types";
import { seedRaiders } from "./seeds/raiders";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");
  await seedSuperAdmin(prisma);
  await seedOfficialData(prisma);
  await seedWeaponTraits(prisma);
  await seedCriticalEffects(prisma);
  await seedWeaponTypes(prisma);
  await seedOfficialWeapons(prisma);
  await seedRaiders();
  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
