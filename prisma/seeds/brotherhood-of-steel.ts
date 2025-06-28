import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

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

async function getUniqueWeaponTemplateName(baseName: string): Promise<string> {
  let newName = baseName;
  let counter = 2;
  while (await db.weaponTemplate.findUnique({ where: { name: newName } })) {
    newName = `${baseName}-${counter}`;
    counter++;
  }
  return newName;
}

export async function seedBrotherhoodOfSteel() {
  console.log("Seeding Brotherhood of Steel faction...");

  const faction = await db.faction.upsert({
    where: { name: "Brotherhood of Steel" },
    update: {},
    create: { name: "Brotherhood of Steel" },
  });

  for (const unitData of brotherhoodOfSteelFactionData) {
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
  console.log("Brotherhood of Steel faction seeded successfully.");
}
