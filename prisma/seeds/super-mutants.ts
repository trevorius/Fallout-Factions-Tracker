import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

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

async function getUniqueWeaponTemplateName(baseName: string): Promise<string> {
  let newName = baseName;
  let counter = 2;
  while (await db.weaponTemplate.findUnique({ where: { name: newName } })) {
    newName = `${baseName}-${counter}`;
    counter++;
  }
  return newName;
}

export async function seedSuperMutants() {
  console.log("Seeding Super Mutants faction...");

  const faction = await db.faction.upsert({
    where: { name: "Super Mutants" },
    update: {},
    create: { name: "Super Mutants" },
  });

  for (const unitData of superMutantsFactionData) {
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
  console.log("Super Mutants faction seeded successfully.");
}
