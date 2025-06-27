import { PrismaClient } from "@prisma/client";

async function seedBaseballBat(prisma: PrismaClient) {
  console.log("Seeding baseball bat...");

  const weaponType = await prisma.weaponType.upsert({
    where: { name: "Melee" },
    update: {},
    create: { name: "Melee" },
  });

  const windUpTrait = await prisma.trait.findFirst({
    where: { name: "Wind Up" },
  });

  const suppressCritical = await prisma.criticalEffect.findFirst({
    where: { name: "Suppress (X)" },
  });

  let baseballBat = await prisma.standardWeapon.findFirst({
    where: { name: "Baseball Bat" },
  });

  if (!baseballBat) {
    baseballBat = await prisma.standardWeapon.create({
      data: {
        name: "Baseball Bat",
        range: "1",
        testAttribute: "S",
        testValue: 3,
        weaponTypeId: weaponType.id,
        rating: 5,
        traits: windUpTrait
          ? {
              create: [
                {
                  trait: {
                    connect: { id: windUpTrait.id },
                  },
                },
              ],
            }
          : undefined,
        criticalEffects: suppressCritical
          ? {
              create: [
                {
                  criticalEffect: {
                    connect: { id: suppressCritical.id },
                  },
                },
              ],
            }
          : undefined,
      },
    });
  }

  const existingUpgrade = await prisma.weaponUpgrade.findFirst({
    where: { name: "Swing for the Fences" },
  });

  if (!existingUpgrade) {
    const newUpgrade = await prisma.weaponUpgrade.create({
      data: {
        name: "Swing for the Fences",
        cost: 2,
      },
    });

    await prisma.standardWeaponAvailableUpgrade.create({
      data: {
        standardWeaponId: baseballBat.id,
        weaponUpgradeId: newUpgrade.id,
      },
    });
  }

  console.log("Baseball bat seeded.");
}

export { seedBaseballBat };
