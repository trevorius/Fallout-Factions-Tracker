import type { PrismaClient } from "@prisma/client";

const weaponTraits = [
  {
    name: "Aim (+X)",
    description:
      "When creating the Dice Pool for an Attack Action with this Weapon, the attacking model can Take Fatigue to add X Bonus Dice to the Pool.",
  },
  {
    name: 'Area (X")',
    description:
      'When making an Attack Action with this Weapon, the Active player nominates a Target point on the Battlefield instead of a Target model. This must be a point Visible to the attacking model on the Battlefield surface, or a Terrain Feature. Each model (from either crew) within X" of the selected point counts as a Target model for the attack. Make a single Attack Test, to which no Bonus Dice can be applied. Then resolve the Inflict Damage step once for each Target model. If a rule adjusts the amount of Damage inflicted, or affects the Target Model, this does not carry over between models. Do not resolve Confusion until Damage has been applied to all models.',
  },
  {
    name: 'Big Swing (X")',
    description:
      'When making an Attack Action with this Weapon, the attacking model can Take Fatigue to increase its Effective Range by X".',
  },
  {
    name: "Bladed",
    description:
      "When a model with this Weapon uses a Makeshift Weapon to make a Melee Attack, add a Bonus Die to the Pool.",
  },
  {
    name: "CQB (Close-Quarters-Battle)",
    description:
      "This Weapon cannot Target models outside of its Effective Range.",
  },
  {
    name: "Creative Projectiles",
    description:
      "When making an Attack Action with this Weapon, the Attacking model's controller may subtract Parts from the crew's Stash. The amount of Parts subtracted alter the Test and Critical Effect of the Weapon Profile to match the details shown on the Creative Projectiles Table. Once the Attack is Resolved, the Test and Critical Effects are reset.\\nNUMBER OF PARTS | TEST | CRITICAL EFFECT\\n--- | --- | ---\\n0* | 3S | Suppress (1)\\n1 | 4S | Suppress (2)\\n2 | 5S | Suppress (3)\\n3+ | 6S | Suppress (3)\\n*Spending 0 Parts does not alter the Weapon's core Profile.",
  },
  {
    name: "Distress Signal",
    description:
      'Models with this weapon gain the following Action:\\nACTION: SEND HELP! (UNENGAGED MODELS)\\nThe Active player chooses a Friendly model other than the model using this Action. That model moves up to 2" (this can be used to move into or out of Engagement).',
  },
  {
    name: "Fast",
    description:
      "Models with this Weapon can make up to two Open Fire, or Brawl Actions within the same Turn, as long as both Actions use this Weapon.",
  },
  {
    name: "Irradiate",
    description:
      'After resolving an Attack Action with this Weapon, the Active player places a Radiation Token in contact with the Target model, or within 1" of the Target point if the Weapon also has the Area (X") Trait.',
  },
  {
    name: "One & Done",
    description:
      "After making an Attack with this Weapon, it cannot be used again this game.",
  },
  {
    name: "Selective Fire (X)",
    description:
      'After declaring an Attack Action with this Weapon, but before creating a Dice Pool, this model\'s controller picks one of the Traits in this Weapons listed Selective Fire Trait (example, Selective Fire (Area (1"), Storm (3))"). This Weapon then gains that Trait until the Attack has Resolved.',
  },
  {
    name: "Slow",
    description:
      "Models with this Weapon may only make one Attack Action using it per Round.",
  },
  {
    name: "Storm (+X)",
    description:
      "When creating a Dice Pool for Attack Action with this Weapon, add X Bonus Dice to the Pool if the Target is within half of the Weapon's Effective Range.",
  },
  {
    name: "Unwieldy (X)",
    description:
      "When a model makes an Attack Action with this Weapon, if its Strength is lower than X, the Attack Test cannot gain any Bonus Dice.",
  },
  {
    name: "Wind Up",
    description:
      "When creating a Dice Pool for an Attack Action with this Weapon, add 2 Bonus Dice instead of 1 if the Active model moved into Engagement with the Target model this Turn.",
  },
];

export async function seedWeaponTraits(prisma: PrismaClient) {
  console.log("Seeding weapon traits...");

  for (const trait of weaponTraits) {
    try {
      await prisma.trait.upsert({
        where: { name: trait.name },
        update: {},
        create: {
          name: trait.name,
          description: trait.description,
        },
      });
      console.log(`  Upserted trait: ${trait.name}`);
    } catch (e) {
      console.error(`Error seeding trait "${trait.name}":`, e);
    }
  }

  console.log("Weapon traits seeding finished.");
}
