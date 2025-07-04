import type { PrismaClient, TranslatableEntity } from "@prisma/client";

interface TranslationData {
  entityType: TranslatableEntity;
  entityId: string;
  fieldName: string;
  translations: {
    en: string;
    fr: string;
  };
}

// Helper function to seed translations
async function seedTranslation(prisma: PrismaClient, data: TranslationData) {
  // English translation
  await prisma.i18n.upsert({
    where: {
      entityType_entityId_locale_fieldName: {
        entityType: data.entityType,
        entityId: data.entityId,
        locale: 'en',
        fieldName: data.fieldName,
      },
    },
    update: {
      translation: data.translations.en,
    },
    create: {
      entityType: data.entityType,
      entityId: data.entityId,
      locale: 'en',
      fieldName: data.fieldName,
      translation: data.translations.en,
    },
  });

  // French translation
  await prisma.i18n.upsert({
    where: {
      entityType_entityId_locale_fieldName: {
        entityType: data.entityType,
        entityId: data.entityId,
        locale: 'fr',
        fieldName: data.fieldName,
      },
    },
    update: {
      translation: data.translations.fr,
    },
    create: {
      entityType: data.entityType,
      entityId: data.entityId,
      locale: 'fr',
      fieldName: data.fieldName,
      translation: data.translations.fr,
    },
  });
}

// Example function to seed faction translations
export async function seedFactionTranslations(prisma: PrismaClient) {
  console.log("Seeding faction translations...");

  // Get all factions
  const factions = await prisma.faction.findMany();

  for (const faction of factions) {
    // Common faction name translations
    const factionTranslations: Record<string, { en: string; fr: string }> = {
      "Raiders": {
        en: "Raiders",
        fr: "Pillards"
      },
      "Survivors": {
        en: "Survivors",
        fr: "Survivants"
      },
      "Super Mutants": {
        en: "Super Mutants",
        fr: "Super Mutants"
      },
      "Brotherhood of Steel": {
        en: "Brotherhood of Steel",
        fr: "Confrérie de l'Acier"
      },
      "NCR": {
        en: "NCR",
        fr: "RNC"
      },
      "Enclave": {
        en: "Enclave",
        fr: "Enclave"
      },
      "Ghouls": {
        en: "Ghouls",
        fr: "Goules"
      },
      "Robots": {
        en: "Robots",
        fr: "Robots"
      }
    };

    const translation = factionTranslations[faction.name] || {
      en: faction.name,
      fr: faction.name
    };

    await seedTranslation(prisma, {
      entityType: "FACTION",
      entityId: faction.id,
      fieldName: "name",
      translations: translation
    });
  }

  console.log("Faction translations seeding complete.");
}

// Example function to seed unit class translations
export async function seedUnitClassTranslations(prisma: PrismaClient) {
  console.log("Seeding unit class translations...");

  const unitClasses = await prisma.unitClass.findMany();

  for (const unitClass of unitClasses) {
    const unitClassTranslations: Record<string, { en: string; fr: string }> = {
      "Leader": {
        en: "Leader",
        fr: "Chef"
      },
      "Champion": {
        en: "Champion",
        fr: "Champion"
      },
      "Grunt": {
        en: "Grunt",
        fr: "Soldat"
      },
      "Elite": {
        en: "Elite",
        fr: "Élite"
      },
      "Rookie": {
        en: "Rookie",
        fr: "Recrue"
      }
    };

    const translation = unitClassTranslations[unitClass.name] || {
      en: unitClass.name,
      fr: unitClass.name
    };

    await seedTranslation(prisma, {
      entityType: "UNIT_CLASS",
      entityId: unitClass.id,
      fieldName: "name",
      translations: translation
    });
  }

  console.log("Unit class translations seeding complete.");
}

// Example function to seed weapon type translations
export async function seedWeaponTypeTranslations(prisma: PrismaClient) {
  console.log("Seeding weapon type translations...");

  const weaponTypes = await prisma.weaponType.findMany();

  for (const weaponType of weaponTypes) {
    const weaponTypeTranslations: Record<string, { en: string; fr: string }> = {
      "Pistol": {
        en: "Pistol",
        fr: "Pistolet"
      },
      "Rifle": {
        en: "Rifle",
        fr: "Fusil"
      },
      "Heavy": {
        en: "Heavy",
        fr: "Lourd"
      },
      "Melee": {
        en: "Melee",
        fr: "Mêlée"
      },
      "Grenade": {
        en: "Grenade",
        fr: "Grenade"
      },
      "Energy": {
        en: "Energy",
        fr: "Énergie"
      }
    };

    const translation = weaponTypeTranslations[weaponType.name] || {
      en: weaponType.name,
      fr: weaponType.name
    };

    await seedTranslation(prisma, {
      entityType: "WEAPON_TYPE",
      entityId: weaponType.id,
      fieldName: "name",
      translations: translation
    });
  }

  console.log("Weapon type translations seeding complete.");
}

// Main i18n seeding function
export async function seedI18n(prisma: PrismaClient) {
  console.log("Starting i18n seeding...");
  
  await seedFactionTranslations(prisma);
  await seedUnitClassTranslations(prisma);
  await seedWeaponTypeTranslations(prisma);
  
  // Add more translation seeding functions as needed
  
  console.log("I18n seeding complete.");
}