import { PrismaClient } from "@prisma/client";
import { seedPerks } from "./seeds/official-data";
import { seedSuperAdmin } from "./seeds/super-admin";
import { seedWeaponTraits } from "./seeds/weapon-traits";
import { seedCriticalEffects } from "./seeds/critical-effects";
import { seedOfficialWeapons } from "./seeds/official-weapons";
import { seedWeaponTypes } from "./seeds/weapon-types";
import { seedRaiders } from "./seeds/raiders";
import { seedSuperMutants } from "./seeds/super-mutants";
import { seedSurvivors } from "./seeds/survivors";
import { seedBrotherhoodOfSteel } from "./seeds/brotherhood-of-steel";
import { seedI18n } from "./seeds/i18n-seed";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");
  await seedSuperAdmin(prisma);
  await seedPerks(prisma);
  await seedWeaponTraits(prisma);
  await seedCriticalEffects(prisma);
  await seedWeaponTypes(prisma);
  await seedOfficialWeapons(prisma);
  await seedRaiders(prisma);
  await seedSuperMutants(prisma);
  await seedSurvivors(prisma);
  await seedBrotherhoodOfSteel(prisma);
  await seedI18n(prisma);
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
