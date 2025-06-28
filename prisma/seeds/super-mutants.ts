import { PrismaClient } from "@prisma/client";

const superMutantsFactionData = [
  {
    unitClassName: "Master",
    unitClassTypes: ["CHAMPION", "LEADER"],
    s: 6,
    p: 5,
    e: 6,
    c: 5,
    i: 5,
    a: 5,
    l: 3,
    hp: 3,
    perks: ["Burly", "Natural Leader", "Rad Resistant"],
    weaponSets: [
      {
        name: "Plasma Pistol & Sledgehammer",
        cost: 46,
        weapons: ["Plasma Pistol", "Sledgehammer"],
      },
      {
        name: "Short Hunting Rifle & Super Sledge",
        cost: 48,
        weapons: ["Short Hunting Rifle", "Super Sledge"],
      },
    ],
  },
  {
    unitClassName: "Brute",
    unitClassTypes: ["CHAMPION"],
    s: 6,
    p: 5,
    e: 6,
    c: 5,
    i: 4,
    a: 5,
    l: 2,
    hp: 2,
    perks: ["Burly", "Rad Resistant"],
    weaponSets: [
      { name: "Laser Rifle", cost: 32, weapons: ["Laser Rifle"] },
      { name: "Sledgehammer", cost: 37, weapons: ["Sledgehammer"] },
      { name: "Minigun", cost: 48, weapons: ["Minigun"] },
    ],
  },
  {
    unitClassName: "Skirmisher",
    unitClassTypes: ["GRUNT"],
    s: 5,
    p: 4,
    e: 5,
    c: 4,
    i: 4,
    a: 4,
    l: 2,
    hp: 1,
    perks: ["Burly", "Rad Resistant"],
    weaponSets: [
      {
        name: "Automatic Pipe Rifle",
        cost: 28,
        weapons: ["Automatic Pipe Rifle"],
      },
      {
        name: "Precision Pipe Rifle",
        cost: 30,
        weapons: ["Precision Pipe Rifle"],
      },
      { name: "Laser Rifle", cost: 33, weapons: ["Laser Rifle"] },
      { name: "Assault Rifle", cost: 33, weapons: ["Assault Rifle"] },
    ],
  },
  {
    unitClassName: "Enforcer",
    unitClassTypes: ["GRUNT"],
    s: 5,
    p: 3,
    e: 5,
    c: 3,
    i: 4,
    a: 4,
    l: 2,
    hp: 1,
    perks: ["Burly", "Rad Resistant"],
    weaponSets: [
      {
        name: "Pipe Pistol & Hand Weapon",
        cost: 17,
        weapons: ["Pipe Pistol", "Hand Weapon"],
      },
      {
        name: "Hand Weapon & Molotov Cocktails",
        cost: 25,
        weapons: ["Hand Weapon", "Molotov Cocktails"],
      },
      {
        name: "Heavy Pipe Pistol & Sledgehammer",
        cost: 25,
        weapons: ["Heavy Pipe Pistol", "Sledgehammer"],
      },
      {
        name: "Molotov Cocktails & Super Sledge",
        cost: 26,
        weapons: ["Molotov Cocktails", "Super Sledge"],
      },
      {
        name: "Short Hunting Rifle & Molotov Cocktails",
        cost: 28,
        weapons: ["Short Hunting Rifle", "Molotov Cocktails"],
      },
    ],
  },
  {
    unitClassName: "Hound",
    unitClassTypes: ["GRUNT"],
    s: 4,
    p: 2,
    e: 4,
    c: 3,
    i: 3,
    a: 5,
    l: 1,
    hp: 1,
    perks: ["Beast", "Burly", "Sic' Em", "Rad Resistant"],
    weaponSets: [{ name: "Claws & Jaws", cost: 10, weapons: ["Claws & Jaws"] }],
  },
];

const allPerks = [...new Set(superMutantsFactionData.flatMap((u) => u.perks))];
const allWeapons = [
  ...new Set(
    superMutantsFactionData
      .flatMap((u) => u.weaponSets)
      .flatMap((ws) => ws.weapons)
  ),
];
const allUnitClassNames = ["CHAMPION", "LEADER", "GRUNT", "SPECIALIST"];

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

export async function seedSuperMutants(prisma: PrismaClient) {
  console.log("Seeding Super Mutants faction...");

  const faction = await prisma.faction.upsert({
    where: { name: "Super Mutants" },
    update: {},
    create: { name: "Super Mutants" },
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

  for (const unitData of superMutantsFactionData) {
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
}
