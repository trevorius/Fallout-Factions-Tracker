import { PrismaClient } from "@prisma/client";

const survivorsFactionData = [
  {
    unitClassName: "Leader",
    unitClassTypes: ["LEADER", "CHAMPION"],
    s: 4,
    p: 6,
    e: 5,
    c: 7,
    i: 6,
    a: 5,
    l: 5,
    hp: 3,
    perks: ["Natural Leader", "Personal Stash"],
    weaponSets: [
      {
        name: "Lever-Action Rifle & Machete",
        cost: 41,
        weapons: ["Lever-Action Rifle", "Machete"],
      },
      {
        name: "Assault Rifle",
        cost: 45,
        weapons: ["Assault Rifle"],
      },
      {
        name: "Combat Rifle & Baseball Bat",
        cost: 48,
        weapons: ["Combat Rifle", "Baseball Bat"],
      },
      {
        name: "Minigun",
        cost: 54,
        weapons: ["Minigun"],
      },
    ],
  },
  {
    unitClassName: "Veteran",
    unitClassTypes: ["CHAMPION"],
    s: 5,
    p: 5,
    e: 5,
    c: 4,
    i: 4,
    a: 5,
    l: 2,
    hp: 2,
    perks: ["Power Armor", "Sticky Fingers"],
    weaponSets: [
      {
        name: "Hunting Rifle",
        cost: 41,
        weapons: ["Hunting Rifle"],
      },
      {
        name: "Flamer",
        cost: 45,
        weapons: ["Flamer"],
      },
      {
        name: "Missile Launcher",
        cost: 56,
        weapons: ["Missile Launcher"],
      },
    ],
  },
  {
    unitClassName: "Technician",
    unitClassTypes: ["CHAMPION"],
    s: 4,
    p: 5,
    e: 4,
    c: 5,
    i: 6,
    a: 4,
    l: 3,
    hp: 2,
    perks: ["Technician"],
    weaponSets: [
      {
        name: "Pipe Pistol & Hand Weapon",
        cost: 23,
        weapons: ["Pipe Pistol", "Hand Weapon"],
      },
      {
        name: "Pipe Pistol & Machete",
        cost: 24,
        weapons: ["Pipe Pistol", "Machete"],
      },
      {
        name: "Sawn-off Shotgun",
        cost: 25,
        weapons: ["Sawn-off Shotgun"],
      },
      {
        name: "Pipe Rifle",
        cost: 25,
        weapons: ["Pipe Rifle"],
      },
    ],
  },
  {
    unitClassName: "Settler",
    unitClassTypes: ["GRUNT"],
    s: 4,
    p: 4,
    e: 4,
    c: 4,
    i: 4,
    a: 4,
    l: 3,
    hp: 1,
    perks: [],
    weaponSets: [
      {
        name: "Short Hunting Rifle",
        cost: 16,
        weapons: ["Short Hunting Rifle"],
      },
      {
        name: "Pipe Rifle",
        cost: 18,
        weapons: ["Pipe Rifle"],
      },
      {
        name: "Sawn-off Shotgun",
        cost: 18,
        weapons: ["Sawn-off Shotgun"],
      },
      {
        name: "Automatic Pipe Rifle",
        cost: 20,
        weapons: ["Automatic Pipe Rifle"],
      },
    ],
  },
  {
    unitClassName: "Wastelander",
    unitClassTypes: ["GRUNT"],
    s: 5,
    p: 4,
    e: 4,
    c: 3,
    i: 3,
    a: 4,
    l: 2,
    hp: 1,
    perks: [],
    weaponSets: [
      {
        name: "Pipe Revolver & Baseball Bat",
        cost: 17,
        weapons: ["Pipe Revolver", "Baseball Bat"],
      },
      {
        name: "Pipe Revolver & Hand Weapon",
        cost: 17,
        weapons: ["Pipe Revolver", "Hand Weapon"],
      },
      {
        name: "Molotov Cocktails & Baseball Bat",
        cost: 19,
        weapons: ["Molotov Cocktails", "Baseball Bat"],
      },
      {
        name: "Baseball Grenades & Hand Weapon",
        cost: 22,
        weapons: ["Baseball Grenades", "Hand Weapon"],
      },
    ],
  },
  {
    unitClassName: "Scavenger",
    unitClassTypes: ["GRUNT"],
    s: 4,
    p: 5,
    e: 3,
    c: 3,
    i: 4,
    a: 3,
    l: 1,
    hp: 1,
    perks: [],
    weaponSets: [
      {
        name: "Pipe Revolver & Baseball Bat",
        cost: 12,
        weapons: ["Pipe Revolver", "Baseball Bat"],
      },
      {
        name: "Pipe Pistol & Molotov Cocktails",
        cost: 13,
        weapons: ["Pipe Pistol", "Molotov Cocktails"],
      },
      {
        name: "Pipe Pistol & Machete",
        cost: 14,
        weapons: ["Pipe Pistol", "Machete"],
      },
      {
        name: "Pipe Rifle",
        cost: 16,
        weapons: ["Pipe Rifle"],
      },
    ],
  },
  {
    unitClassName: "Specialist",
    s: 4,
    p: 4,
    e: 4,
    c: 4,
    i: 4,
    a: 4,
    l: 4,
    hp: 1,
    perks: [],
    unitClassTypes: ["SPECIALIST"],
    weaponSets: [],
    variations: [
      {
        name: "Sniper",
        unitClassTypes: ["SPECIALIST"],
        weaponSets: [
          { name: "Sniper Rifle", cost: 45, weapons: ["Sniper Rifle"] },
        ],
      },
      {
        name: "Heavy",
        unitClassTypes: ["SPECIALIST"],
        weaponSets: [
          { name: "Flamer", cost: 45, weapons: ["Flamer"] },
          { name: "Missile Launcher", cost: 56, weapons: ["Missile Launcher"] },
        ],
      },
    ],
  },
];
const allPerks = [...new Set(survivorsFactionData.flatMap((u) => u.perks))];
const allWeapons = [
  ...new Set(
    survivorsFactionData
      .flatMap((u) => u.weaponSets)
      .concat(
        survivorsFactionData
          .filter((u) => u.variations)
          .flatMap((u) => u.variations!)
          .flatMap((v) => v.weaponSets)
      )
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

export async function seedSurvivors(prisma: PrismaClient) {
  console.log("Seeding The Survivors faction...");

  const faction = await prisma.faction.upsert({
    where: { name: "The Survivors" },
    update: {},
    create: { name: "The Survivors" },
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

  for (const unitData of survivorsFactionData) {
    console.log(`- Processing Unit: ${unitData.unitClassName}`);
    try {
      if (unitData.unitClassName === "Specialist") {
        // Handle Specialist variations
        for (const variation of unitData.variations!) {
          const typeName = variation.unitClassTypes.includes("LEADER")
            ? "LEADER"
            : variation.unitClassTypes[0];
          const unitClass = await prisma.unitClass.findFirst({
            where: { name: { equals: typeName, mode: "insensitive" } },
          });

          if (!unitClass) {
            console.error(
              `Could not find unit class for type: ${typeName}. Skipping specialist variation.`
            );
            continue;
          }

          const unitName = `${variation.name}`;
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

          for (const weaponSet of variation.weaponSets) {
            const templateName = await getUniqueWeaponTemplateName(
              prisma,
              `${unitName} - ${weaponSet.name}`
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
            await prisma.unitTemplateWeaponTemplate.create({
              data: {
                unitTemplateId: unitTemplate.id,
                weaponTemplateId: weaponTemplate.id,
              },
            });
          }
        }
      } else {
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
      }
    } catch (error) {
      console.error(`Failed to process unit ${unitData.unitClassName}:`, error);
    }
  }
}
