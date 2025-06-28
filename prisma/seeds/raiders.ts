import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const raidersFactionData = [
  {
    unitClassName: "Boss",
    unitClassTypes: ["CHAMPION", "LEADER"],
    s: 5,
    p: 5,
    e: 6,
    c: 5,
    i: 5,
    a: 5,
    l: 3,
    hp: 3,
    perks: ["Natural Leader", "Personal Stash", "Power Armor"],
    weaponSets: [
      {
        name: ".44 Pistol & Machete",
        cost: 40,
        weapons: [".44 Pistol", "Machete"],
      },
      { name: "Assault Rifle", cost: 45, weapons: ["Assault Rifle"] },
      {
        name: "Combat Rifle & Baseball Bat",
        cost: 48,
        weapons: ["Combat Rifle", "Baseball Bat"],
      },
      { name: "Minigun", cost: 54, weapons: ["Minigun"] },
    ],
  },
  {
    unitClassName: "Butcher",
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
      { name: "Hunting Rifle", cost: 41, weapons: ["Hunting Rifle"] },
      { name: "Flamer", cost: 45, weapons: ["Flamer"] },
      { name: "Missile Launcher", cost: 56, weapons: ["Missile Launcher"] },
    ],
  },
  {
    unitClassName: "Veteran",
    unitClassTypes: ["CHAMPION"],
    s: 4,
    p: 4,
    e: 4,
    c: 4,
    i: 4,
    a: 4,
    l: 2,
    hp: 2,
    perks: ["Sticky Fingers"],
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
      { name: "Sawn-off Shotgun", cost: 25, weapons: ["Sawn-off Shotgun"] },
      { name: "Pipe Rifle", cost: 25, weapons: ["Pipe Rifle"] },
    ],
  },
  {
    unitClassName: "Scavver",
    unitClassTypes: ["GRUNT"],
    s: 3,
    p: 4,
    e: 4,
    c: 3,
    i: 3,
    a: 3,
    l: 2,
    hp: 1,
    perks: [],
    weaponSets: [
      {
        name: "Short Hunting Rifle",
        cost: 16,
        weapons: ["Short Hunting Rifle"],
      },
      { name: "Pipe Rifle", cost: 18, weapons: ["Pipe Rifle"] },
      { name: "Sawn-off Shotgun", cost: 18, weapons: ["Sawn-off Shotgun"] },
      {
        name: "Automatic Pipe Rifle",
        cost: 20,
        weapons: ["Automatic Pipe Rifle"],
      },
    ],
  },
  {
    unitClassName: "Psycho",
    unitClassTypes: ["GRUNT"],
    s: 4,
    p: 3,
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
    unitClassName: "Scum",
    unitClassTypes: ["GRUNT"],
    s: 3,
    p: 3,
    e: 3,
    c: 3,
    i: 3,
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
      { name: "Pipe Rifle", cost: 16, weapons: ["Pipe Rifle"] },
    ],
  },
];

const allPerks = [...new Set(raidersFactionData.flatMap((u) => u.perks))];
const allWeapons = [
  ...new Set(
    raidersFactionData.flatMap((u) => u.weaponSets).flatMap((ws) => ws.weapons)
  ),
];
const allUnitClassNames = ["CHAMPION", "LEADER", "GRUNT"];

async function getUniqueWeaponTemplateName(baseName: string): Promise<string> {
  let newName = baseName;
  let counter = 2;
  while (await db.weaponTemplate.findUnique({ where: { name: newName } })) {
    newName = `${baseName}-${counter}`;
    counter++;
  }
  return newName;
}

export async function seedRaiders() {
  console.log("Seeding Wasteland Raiders faction...");

  const faction = await db.faction.upsert({
    where: { name: "Wasteland Raiders" },
    update: {},
    create: { name: "Wasteland Raiders" },
  });

  for (const name of allUnitClassNames) {
    await db.unitClass.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const name of allPerks) {
    await db.perk.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // This is needed to get around a shortcoming of upsert with relations
  const placeholderWeaponType = await db.weaponType.upsert({
    where: { name: "placeholder" },
    update: {},
    create: { name: "placeholder" },
  });

  for (const name of allWeapons) {
    await db.standardWeapon.upsert({
      where: { name },
      update: {},
      create: {
        name,
        range: "0-0",
        testAttribute: "S",
        testValue: 0,
        rating: 0,
        weaponTypeId: placeholderWeaponType.id,
      }, // Placeholder data
    });
  }

  for (const unitData of raidersFactionData) {
    console.log(`- Processing Unit: ${unitData.unitClassName}`);
    try {
      for (const typeName of unitData.unitClassTypes) {
        const unitClass = await db.unitClass.findFirst({
          where: { name: { equals: typeName, mode: "insensitive" } },
        });
        if (!unitClass) {
          console.error(`  - Skipping: UnitClass '${typeName}' not found.`);
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

        // Link perks
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

        // Create and link weapon templates
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
            console.error(
              `      - ERROR: Not all standard weapons found for Weapon Set '${ws.name}'. Skipping.`
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
      }
    } catch (error) {
      console.error(
        `  - ERROR processing unit ${unitData.unitClassName}:`,
        error
      );
    }
  }
  console.log("Wasteland Raiders faction seeded successfully.");
}
