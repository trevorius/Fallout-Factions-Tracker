# Unit Template Management

`UnitTemplate`s are the foundational blueprints for every character and creature in the Fallout Factions Tracker. They define the core attributes, skills, and available equipment for a specific type of unit within a faction. This guide explains how Super Admins manage these critical assets.

## The Role of a Unit Template

A `UnitTemplate` brings together all the core components that make a unit unique:

- **Base Stats**: The S.P.E.C.I.A.L. attributes and Hit Points (HP).
- **Faction Allegiance**: Every template must be linked to a `Faction`.
- **Unit Class**: Defines the unit's role on the battlefield (e.g., "LEADER", "GRUNT", "CHAMPION"). This is determined by its link to a `UnitClass`.
- **Perks**: The innate abilities the unit possesses, linked via `UnitTemplatePerk`.
- **Weapon Loadouts**: The available weapon packages the unit can take, linked via `UnitTemplateWeaponTemplate`.

This structure allows for creating diverse units like a "Raider Boss" or a "Brotherhood Knight" by combining different stats, classes, perks, and weapon templates.

## Management Workflow

Like all other core game data, `UnitTemplate`s are managed through the seeding process. Each faction's seed file contains the definitions for its unique units.

### Creating a New Unit Template

1.  **Choose a Faction Seed File**: Navigate to the seed file for the faction you want to add a unit to (e.g., `prisma/seeds/brotherhood-of-steel.ts`).
2.  **Add to the Data Array**: Find the main data array (e.g., `brotherhoodOfSteelFactionData`) and add a new object for your unit template.
3.  **Define the Unit**:
    - Provide a `unitClassName` (e.g., "Paladin").
    - Set the S.P.E.C.I.A.L. stats and `hp`.
    - Assign one or more `unitClassTypes`.
    - List the `perks` the unit has by name.
    - Define the `weaponSets`. Each set is a `WeaponTemplate` that will be created, consisting of a name, a `cost`, and an array of `StandardWeapon` names.
4.  **Run the Seed**: Reset the database to have the seed script create the new unit template and all its associated links.
    ```bash
    npx prisma migrate reset --force
    ```

## Key Dependencies

Before a `UnitTemplate` can be created successfully by the seed script, the following assets must already be defined in the database (usually by an earlier-running seed script like `official-data.ts` or `official-weapons.ts`):

- The `Faction` it belongs to.
- The `UnitClass`(es) it uses.
- All `Perk`s listed in its data.
- All `StandardWeapon`s included in its `weaponSets`.

The seed scripts are ordered to ensure these dependencies are met, but it is a critical consideration when adding or modifying data.
