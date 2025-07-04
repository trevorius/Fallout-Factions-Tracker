import type { PrismaClient } from "@prisma/client";

const criticalEffects = [
  {
    name: "Pushback (X)",
    description:
      "At the end of the Inflict Damage step, the opposing player rolls X dice. For each one that scores higher than the Target model's Strength, it is moved 1\" directly away from the Active model. If the Target model cannot move this full distance, it moves as far as it can.",
  },
  {
    name: "Tranquilize (X)",
    description:
      "At the end of the Inflict Damage step, the opposing player rolls X dice. For each one that scores higher than the Target model's Endurance, it suffers one Harm, with Excess Harm causing an Injury. Should this Injury Incapacitate the Target model, do not roll for it during the Treat the Wounded step of the Story Phase, it instead gains the Clean Bill of Health result.",
  },
  {
    name: "Ignite (X)",
    description:
      "At the start of the Inflict Damage step, the opposing player rolls X dice. For each one that scores higher than the Target model's Agility, the amount of Damage inflicted is increased by 1.",
  },
  {
    name: "Maim",
    description:
      "At the end of the Inflict Damage step, the Target suffers 1 Harm.",
  },
  {
    name: "Meltdown",
    description:
      "At the end of the Inflict Damage step, the opposing player makes a Meltdown Test (2E) for the Target model. If the opposing player scores fewer Hits than the amount of Harm the Target model has, it suffers an Injury.",
  },
  {
    name: "Pierce",
    description:
      "During the Inflict Damage step, the Target's Endurance is treated as one lower (to a minimum of 1).",
  },
  {
    name: "Poison (X)",
    description:
      "At the end of the Inflict Damage step, the opposing player rolls X dice. For each one that scores higher than the Target model's Endurance, it suffers one Harm, with Excess Harm causing an Injury.",
  },
  {
    name: "Suppress (X)",
    description:
      "At the end of the Inflict Damage step, the opposing player rolls X dice. For each one that scores higher than the Target model's Intelligence, it Suffers 1 Fatigue.",
  },
];

export async function seedCriticalEffects(prisma: PrismaClient) {
  console.log("Seeding critical effects...");
  for (const criticalEffect of criticalEffects) {
    try {
      await prisma.criticalEffect.upsert({
        where: { name: criticalEffect.name },
        update: {},
        create: {
          name: criticalEffect.name,
          description: criticalEffect.description,
        },
      });
      console.log(`  Upserted critical effect: ${criticalEffect.name}`);
    } catch (e) {
      console.error(
        `Error seeding critical effect "${criticalEffect.name}":`,
        e
      );
    }
  }
  console.log("Critical effects seeding finished.");
}
