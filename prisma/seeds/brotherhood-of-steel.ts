import { PrismaClient } from "@prisma/client";

const brotherhoodOfSteelFactionData = [
  {
    unitClassName: "Paladin",
    unitClassTypes: ["CHAMPION", "LEADER"],
    s: 7,
    p: 5,
    e: 7,
    c: 6,
    i: 5,
    a: 4,
    l: 2,
    hp: 4,
    perks: ["Natural Leader", "Power Armor"],
    weaponSets: [
      { name: "Flamer", cost: 67, weapons: ["Flamer"] },
      { name: "Gatling Laser", cost: 72, weapons: ["Gatling Laser"] },
      { name: "Minigun", cost: 79, weapons: ["Minigun"] },
    ],
  },
  {
    unitClassName: "Field Scribe",
    unitClassTypes: ["CHAMPION"],
    s: 3,
    p: 4,
    e: 4,
    c: 3,
    i: 6,
    a: 4,
    l: 2,
    hp: 2,
    perks: ["Spotter"],
    weaponSets: [
      { name: "Laser Pistol", cost: 21, weapons: ["Laser Pistol"] },
      { name: "10mm Pistol", cost: 26, weapons: ["10mm Pistol"] },
      { name: "Crusader Pistol", cost: 31, weapons: ["Crusader Pistol"] },
    ],
  },
  {
    unitClassName: "Knight",
    unitClassTypes: ["GRUNT"],
    s: 6,
    p: 5,
    e: 6,
    c: 4,
    i: 4,
    a: 4,
    l: 2,
    hp: 3,
    perks: ["Power Armor"],
    weaponSets: [
      {
        name: "Laser Pistol & Machete",
        cost: 50,
        weapons: ["Laser Pistol", "Machete"],
      },
      { name: "Ripper", cost: 55, weapons: ["Ripper"] },
      { name: "Laser Rifle", cost: 60, weapons: ["Laser Rifle"] },
    ],
  },
  {
    unitClassName: "Aspirant",
    unitClassTypes: ["GRUNT"],
    s: 4,
    p: 5,
    e: 5,
    c: 4,
    i: 4,
    a: 4,
    l: 2,
    hp: 1,
    perks: [],
    weaponSets: [
      {
        name: "Laser Pistol & Hand Weapon",
        cost: 20,
        weapons: ["Laser Pistol", "Hand Weapon"],
      },
      {
        name: "Crusader Pistol & Hand Weapon",
        cost: 23,
        weapons: ["Crusader Pistol", "Hand Weapon"],
      },
      { name: "Combat Rifle", cost: 24, weapons: ["Combat Rifle"] },
      { name: "Laser Rifle", cost: 25, weapons: ["Laser Rifle"] },
    ],
  },
  {
    unitClassName: "Initiate",
    unitClassTypes: ["GRUNT"],
    s: 3,
    p: 4,
    e: 4,
    c: 3,
    i: 4,
    a: 4,
    l: 2,
    hp: 1,
    perks: ["Sprint"],
    weaponSets: [
      {
        name: "Recon Hunting Rifle",
        cost: 19,
        weapons: ["Recon Hunting Rifle"],
      },
      { name: "Laser Rifle", cost: 23, weapons: ["Laser Rifle"] },
      { name: "Combat Rifle", cost: 24, weapons: ["Combat Rifle"] },
    ],
  },
];

const allPerks = [
  ...new Set(brotherhoodOfSteelFactionData.flatMap((u) => u.perks)),
];
const allWeapons = [
  ...new Set(
    brotherhoodOfSteelFactionData
      .flatMap((u) => u.weaponSets)
      .flatMap((ws) => ws.weapons)
  ),
];
const allUnitClassNames = ["CHAMPION", "LEADER", "GRUNT"];

async function getUniqueWeaponTemplateName(
  prisma: PrismaClient,
  baseName: string
): Promise<string> {
  let newName = baseName;
  let counter = 2;
  while (await prisma.weaponTemplate.findUnique({ where: { name: newName } })) {
    newName = `${baseName}-${counter}`;
    counter++;
  }
  return newName;
}

export async function seedBrotherhoodOfSteel(prisma: PrismaClient) {
  console.log("Seeding Brotherhood of Steel faction...");

  const faction = await prisma.faction.upsert({
    where: { name: "Brotherhood of Steel" },
    update: {},
    create: { name: "Brotherhood of Steel" },
  });

  for (const name of allUnitClassNames) {
    await prisma.unitClass.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const placeholderWeaponType = await prisma.weaponType.upsert({
    where: { name: "placeholder" },
    update: {},
    create: { name: "placeholder" },
  });

  for (const name of allWeapons) {
    await prisma.standardWeapon.upsert({
      where: { name },
      update: {},
      create: {
        name,
        range: "0-0",
        testAttribute: "S",
        testValue: 0,
        rating: 0,
        weaponTypeId: placeholderWeaponType.id,
      },
    });
  }

  for (const unitData of brotherhoodOfSteelFactionData) {
    console.log(`- Processing Unit: ${unitData.unitClassName}`);
    try {
      const typeName = unitData.unitClassTypes.includes("LEADER")
        ? "LEADER"
        : unitData.unitClassTypes[0];

      const unitClass = await prisma.unitClass.findFirst({
        where: { name: { equals: typeName, mode: "insensitive" } },
      });
      if (!unitClass) {
        console.error(
          `Could not find unit class for type: ${typeName}. Skipping unit.`
        );
        continue;
      }

      for (const weaponSet of unitData.weaponSets) {
        const templateName = await getUniqueWeaponTemplateName(
          prisma,
          `${unitData.unitClassName} - ${weaponSet.name}`
        );
        const weaponTemplate = await prisma.weaponTemplate.upsert({
          where: { name: templateName },
          update: {},
          create: {
            name: templateName,
            cost: weaponSet.cost,
          },
        });

        for (const weaponName of weaponSet.weapons) {
          const weapon = await prisma.standardWeapon.findFirst({
            where: { name: { equals: weaponName, mode: "insensitive" } },
          });
          if (weapon) {
            await prisma.weaponTemplateStandardWeapon.create({
              data: {
                weaponTemplateId: weaponTemplate.id,
                standardWeaponId: weapon.id,
              },
            });
          } else {
            console.warn(`Weapon not found for template: ${weaponName}`);
          }
        }

        const unitName = `${unitData.unitClassName} (${weaponSet.name})`;
        const unitTemplate = await prisma.unitTemplate.upsert({
          where: { name: unitName },
          update: {},
          create: {
            name: unitName,
            s: unitData.s,
            p: unitData.p,
            e: unitData.e,
            c: unitData.c,
            i: unitData.i,
            a: unitData.a,
            l: unitData.l,
            hp: unitData.hp,
            factionId: faction.id,
            unitClassId: unitClass.id,
          },
        });

        await prisma.unitTemplateWeaponTemplate.create({
          data: {
            unitTemplateId: unitTemplate.id,
            weaponTemplateId: weaponTemplate.id,
          },
        });

        for (const perkName of unitData.perks) {
          const perk = await prisma.perk.findFirst({
            where: { name: { equals: perkName, mode: "insensitive" } },
          });
          if (perk) {
            await prisma.unitTemplatePerk.create({
              data: {
                unitTemplateId: unitTemplate.id,
                perkId: perk.id,
              },
            });
          }
        }
      }
    } catch (error) {
      console.error(`Failed to process unit ${unitData.unitClassName}:`, error);
    }
  }
  console.log("Brotherhood of Steel faction seeded successfully.");
}
