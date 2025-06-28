import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const survivorsFactionData = [
  {
    unitClassName: "Local Leader",
    unitClassTypes: ["CHAMPION", "LEADER"],
    s: 4,
    p: 5,
    e: 5,
    c: 6,
    i: 6,
    a: 5,
    l: 3,
    hp: 3,
    perks: ["Inspirational", "Natural Leader", "Survivalist"],
    weaponSets: [
      { name: "Junk Jet", cost: 34, weapons: ["Junk Jet"] },
      {
        name: "Sawn-off Shotgun & Officer's Sword",
        cost: 40,
        weapons: ["Sawn-off Shotgun", "Officer's Sword"],
      },
      { name: "Combat Rifle", cost: 45, weapons: ["Combat Rifle"] },
    ],
  },
  // Specialists are broken into three distinct units
  {
    unitClassName: "Specialist Hunter",
    unitClassTypes: ["CHAMPION"],
    s: 3,
    p: 5,
    e: 4,
    c: 5,
    i: 6,
    a: 4,
    l: 2,
    hp: 2,
    perks: ["Sniper", "Survivalist"],
    weaponSets: [
      {
        name: "Precision Hunting Rifle",
        cost: 35,
        weapons: ["Precision Hunting Rifle"],
      },
      {
        name: "Double-barreled Shotgun",
        cost: 38,
        weapons: ["Double-barreled Shotgun"],
      },
    ],
  },
  {
    unitClassName: "Specialist Medic",
    unitClassTypes: ["CHAMPION"],
    s: 3,
    p: 5,
    e: 4,
    c: 5,
    i: 6,
    a: 4,
    l: 2,
    hp: 2,
    perks: ["Medic", "Survivalist"],
    weaponSets: [{ name: "Hand Weapon", cost: 20, weapons: ["Hand Weapon"] }],
  },
  {
    unitClassName: "Specialist Trader",
    unitClassTypes: ["CHAMPION"],
    s: 3,
    p: 5,
    e: 4,
    c: 5,
    i: 6,
    a: 4,
    l: 2,
    hp: 2,
    perks: ["Fortune Finder", "Survivalist"],
    weaponSets: [{ name: "Flare Gun", cost: 24, weapons: ["Flare Gun"] }],
  },
  {
    unitClassName: "Security Guard",
    unitClassTypes: ["GRUNT"],
    s: 3,
    p: 4,
    e: 5,
    c: 3,
    i: 3,
    a: 4,
    l: 2,
    hp: 1,
    perks: ["Survivalist"],
    weaponSets: [
      { name: "Hunting Rifle", cost: 22, weapons: ["Hunting Rifle"] },
      {
        name: "Automatic Pipe Rifle",
        cost: 24,
        weapons: ["Automatic Pipe Rifle"],
      },
      { name: "Combat Rifle", cost: 27, weapons: ["Combat Rifle"] },
    ],
  },
  {
    unitClassName: "Swatter",
    unitClassTypes: ["GRUNT"],
    s: 4,
    p: 3,
    e: 5,
    c: 3,
    i: 3,
    a: 4,
    l: 2,
    hp: 1,
    perks: ["Survivalist"],
    weaponSets: [
      {
        name: "Pipe Revolver & Hand Weapon",
        cost: 21,
        weapons: ["Pipe Revolver", "Hand Weapon"],
      },
      {
        name: "Pipe Revolver & Baseball Bat",
        cost: 21,
        weapons: ["Pipe Revolver", "Baseball Bat"],
      },
      {
        name: "Baseball Grenades & Baseball Bat",
        cost: 25,
        weapons: ["Baseball Grenades", "Baseball Bat"],
      },
      {
        name: "Sawn-off Shotgun & Hand Weapon",
        cost: 27,
        weapons: ["Sawn-off Shotgun", "Hand Weapon"],
      },
    ],
  },
  {
    unitClassName: "Good Boy",
    unitClassTypes: ["GRUNT"],
    s: 4,
    p: 3,
    e: 3,
    c: 3,
    i: 3,
    a: 4,
    l: 1,
    hp: 1,
    perks: ["Beast", "Sic 'Em", "Survivalist"],
    weaponSets: [{ name: "Claws & Jaws", cost: 7, weapons: ["Claws & Jaws"] }],
  },
  {
    unitClassName: "Settler",
    unitClassTypes: ["GRUNT"],
    s: 3,
    p: 4,
    e: 3,
    c: 3,
    i: 4,
    a: 3,
    l: 1,
    hp: 1,
    perks: ["Survivalist"],
    weaponSets: [
      { name: "Hand Weapon", cost: 8, weapons: ["Hand Weapon"] },
      {
        name: "Pipe Revolver & Hand Weapon",
        cost: 14,
        weapons: ["Pipe Revolver", "Hand Weapon"],
      },
      {
        name: "Double-barreled Shotgun",
        cost: 15,
        weapons: ["Double-barreled Shotgun"],
      },
      {
        name: "Pipe Bolt-Action Rifle",
        cost: 16,
        weapons: ["Pipe Bolt-Action Rifle"],
      },
    ],
  },
];

async function getUniqueWeaponTemplateName(baseName: string): Promise<string> {
  let newName = baseName;
  let counter = 2;
  while (await db.weaponTemplate.findUnique({ where: { name: newName } })) {
    newName = `${baseName}-${counter}`;
    counter++;
  }
  return newName;
}

export async function seedSurvivors() {
  console.log("Seeding The Survivors faction...");

  const faction = await db.faction.upsert({
    where: { name: "The Survivors" },
    update: {},
    create: { name: "The Survivors" },
  });

  for (const unitData of survivorsFactionData) {
    console.log(`- Processing Unit: ${unitData.unitClassName}`);
    try {
      const typeName = unitData.unitClassTypes.includes("LEADER")
        ? "LEADER"
        : unitData.unitClassTypes[0];

      const unitClass = await db.unitClass.findFirst({
        where: { name: { equals: typeName, mode: "insensitive" } },
      });
      if (!unitClass) {
        console.error(
          `  - Skipping: UnitClass '${typeName}' not found for unit '${unitData.unitClassName}'.`
        );
        continue;
      }

      const unitTemplate = await db.unitTemplate.upsert({
        where: { name: unitData.unitClassName },
        update: {
          s: unitData.s,
          p: unitData.p,
          e: unitData.e,
          c: unitData.c,
          i: unitData.i,
          a: unitData.a,
          l: unitData.l,
          hp: unitData.hp,
          unitClassId: unitClass.id,
        },
        create: {
          name: unitData.unitClassName,
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

      const perkIds = (
        await Promise.all(
          unitData.perks.map((p) =>
            db.perk.findFirst({
              where: { name: { equals: p, mode: "insensitive" } },
            })
          )
        )
      )
        .filter((p) => p)
        .map((p) => p!.id);
      await db.unitTemplatePerk.deleteMany({
        where: { unitTemplateId: unitTemplate.id },
      });
      if (perkIds.length > 0) {
        await db.unitTemplatePerk.createMany({
          data: perkIds.map((perkId) => ({
            unitTemplateId: unitTemplate.id,
            perkId,
          })),
        });
        console.log(`  - Linked ${perkIds.length} perks.`);
      }

      for (const ws of unitData.weaponSets) {
        console.log(`    - Processing Weapon Set: ${ws.name}`);
        const weaponIds = (
          await Promise.all(
            ws.weapons.map((w) =>
              db.standardWeapon.findFirst({
                where: { name: { equals: w, mode: "insensitive" } },
              })
            )
          )
        )
          .filter((w) => w)
          .map((w) => w!.id);

        if (weaponIds.length !== ws.weapons.length) {
          const notFound = ws.weapons.filter((w) => !weaponIds.includes(w));
          console.error(
            `      - ERROR: Standard weapon(s) not found for Weapon Set '${
              ws.name
            }': ${notFound.join(", ")}. Skipping.`
          );
          continue;
        }

        const uniqueWsName = await getUniqueWeaponTemplateName(ws.name);

        const weaponTemplate = await db.weaponTemplate.create({
          data: { name: uniqueWsName, cost: ws.cost },
        });

        await db.weaponTemplateStandardWeapon.createMany({
          data: weaponIds.map((weaponId) => ({
            weaponTemplateId: weaponTemplate.id,
            standardWeaponId: weaponId,
          })),
        });

        await db.unitTemplateWeaponTemplate.create({
          data: {
            unitTemplateId: unitTemplate.id,
            weaponTemplateId: weaponTemplate.id,
          },
        });
        console.log(
          `      - Created and linked Weapon Template: ${uniqueWsName}`
        );
      }
    } catch (error) {
      console.error(
        `  - ERROR processing unit ${unitData.unitClassName}:`,
        error
      );
    }
  }
  console.log("The Survivors faction seeded successfully.");
}
