import { PrismaClient } from "@prisma/client";
import { weapons } from "./data/official-weapon-data";

async function seedOfficialWeapons(prisma: PrismaClient) {
  console.log("Seeding official weapons...");

  for (const weapon of weapons) {
    let standardWeapon = await prisma.standardWeapon.findFirst({
      where: { name: weapon.name },
    });

    if (!standardWeapon) {
      const weaponType = await prisma.weaponType.upsert({
        where: { name: weapon.base.weaponType },
        update: {},
        create: { name: weapon.base.weaponType },
      });

      const traitPromises =
        weapon.base.traits?.map((traitName) =>
          prisma.trait.findFirst({ where: { name: traitName } })
        ) ?? [];

      const criticalEffectPromises =
        weapon.base.criticalEffects?.map((effectName) =>
          prisma.criticalEffect.findFirst({
            where: { name: effectName },
          })
        ) ?? [];

      const traits = (await Promise.all(traitPromises))
        .filter((t) => t)
        .map((t) => t!.id);

      const criticalEffects = (await Promise.all(criticalEffectPromises))
        .filter((c) => c)
        .map((c) => c!.id);

      try {
        const newWeapon = await prisma.standardWeapon.create({
          data: {
            name: weapon.name,
            range: weapon.base.range,
            testAttribute: weapon.base.testAttribute,
            testValue: weapon.base.testValue,
            rating: weapon.base.rating,
            notes: weapon.base.notes,
            weaponTypeId: weaponType.id,
            traits: {
              create: traits.map((id) => ({
                trait: { connect: { id } },
              })),
            },
            criticalEffects: {
              create: criticalEffects.map((id) => ({
                criticalEffect: { connect: { id } },
              })),
            },
          },
        });
        console.log(`  Created weapon: ${newWeapon.name}`);
        standardWeapon = newWeapon;
      } catch (e) {
        console.error(`Error creating weapon ${weapon.name}:`, e);
      }
    }

    if (standardWeapon && weapon.upgrades) {
      for (const upgrade of weapon.upgrades) {
        const existingUpgrade = await prisma.weaponUpgrade.findFirst({
          where: { name: upgrade.name },
        });

        if (!existingUpgrade) {
          const traitPromises =
            upgrade.traits?.map((traitName) =>
              prisma.trait.findFirst({ where: { name: traitName } })
            ) ?? [];

          const criticalEffectPromises =
            upgrade.criticalEffects?.map((effectName) =>
              prisma.criticalEffect.findFirst({
                where: { name: effectName },
              })
            ) ?? [];

          const traits = (await Promise.all(traitPromises))
            .filter((t) => t)
            .map((t) => t!.id);

          const criticalEffects = (await Promise.all(criticalEffectPromises))
            .filter((c) => c)
            .map((c) => c!.id);

          const newUpgrade = await prisma.weaponUpgrade.create({
            data: {
              name: upgrade.name,
              cost: upgrade.cost,
              ratingNew: upgrade.ratingNew,
              testValueNew: upgrade.testValueNew,
              rangeNew: upgrade.rangeNew,
              traits: {
                create: traits.map((id) => ({
                  trait: { connect: { id } },
                })),
              },
              criticalEffects: {
                create: criticalEffects.map((id) => ({
                  criticalEffect: { connect: { id } },
                })),
              },
            },
          });

          await prisma.standardWeaponAvailableUpgrade.create({
            data: {
              standardWeaponId: standardWeapon.id,
              weaponUpgradeId: newUpgrade.id,
            },
          });
          console.log(`  Created upgrade: ${newUpgrade.name}`);
        }
      }
    }
  }

  console.log("Official weapons seeded.");
}

export { seedOfficialWeapons };
