# Faction Management

Factions are a cornerstone of the Fallout Factions Tracker, representing the major groups players can align with, such as the "Brotherhood of Steel" or "Super Mutants". This guide outlines the Super Admin's role in managing these core game assets.

## Factions as Master Templates

In this application, a `Faction` is a global template created and managed exclusively by a **Super Admin**. It serves as a container for `UnitTemplates` that define the types of characters available to that faction.

Organization Admins cannot create or edit factions. Instead, they can choose from the master list of factions created by the Super Admin to make them available within their specific campaigns. This is handled through the `OrganizationFaction` join table.

## The Seeding Process

Currently, all official factions, along with their associated units, perks, and weapons, are created through a database seeding process. The seed scripts (located in `prisma/seeds/`) serve as the definitive source for creating and defining these core game elements.

- **`prisma/seeds/official-data.ts`**: This script is responsible for seeding the foundational game elements that factions rely on, including:
  - `Perk`: Special abilities for units.
  - `Trait`: Inherent qualities of weapons.
  - `CriticalEffect`: Special outcomes on critical hits.
- **Faction-Specific Seed Files**: Files like `prisma/seeds/raiders.ts` and `prisma/seeds/super-mutants.ts` handle the creation of the factions themselves, their unique `UnitTemplate`s, and the `WeaponTemplate` loadouts for those units.

## Managing Faction Data

To add, remove, or modify a faction or its units, a Super Admin must perform the following steps:

1.  **Modify the Data Array**: Open the relevant data array file (e.g., `raidersFactionData` in `prisma/seeds/raiders.ts`).
2.  **Update the Data**: Make the desired changes directly to the objects within the array. This could involve changing a unit's stats, adding a new perk, or defining a new weapon set.
3.  **Reset the Database**: Run the seed command to apply the changes to the database. This will wipe the existing data and re-seed it with your updated configurations.

    ```bash
    npx prisma migrate reset --force
    ```

This approach ensures that all game data remains consistent and is version-controlled alongside the application's source code.
