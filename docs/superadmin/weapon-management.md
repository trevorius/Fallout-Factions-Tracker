# Weapon & Upgrade Management

The weapon system in the Fallout Factions Tracker is designed to be both structured and flexible. A Super Admin is responsible for creating and defining all the base weapons and their potential upgrades, which then form the building blocks for unit loadouts.

## Core Weapon Concepts

There are three key models that make up the weapon system:

1.  **`StandardWeapon`**: This is the base template for a weapon, like a "Laser Rifle" or a "Sledgehammer". It defines the weapon's core statistics, its `WeaponType`, and which `WeaponUpgrade`s are available for it.
2.  **`WeaponUpgrade`**: This represents a modification that can be applied to a `StandardWeapon`, such as a "Boosted Emitter" or a "Serrated Edge". Each upgrade has a `cost` and can provide new `Traits` or `CriticalEffects`.
3.  **`WeaponTemplate`**: This is a specific "loadout" or package that a unit can equip. It consists of one or more `StandardWeapon`s and has a final `cost` in caps. For example, a "Knight's Loadout" might include a "Laser Rifle" and a "Combat Knife" for a total cost. These templates are what are ultimately linked to a `UnitTemplate`.

## Management Workflow

Similar to factions, all weapon-related assets are currently managed via the database seeding process. This ensures that the core game rules are consistent and version-controlled.

### Creating a New Standard Weapon

1.  **Navigate to `prisma/seeds/official-weapons.ts`**: This file contains the `seedOfficialWeapons` function.
2.  **Define the Weapon**: Add a new entry to the `weaponsData` array. You must define its name, stats, and type.
3.  **Define Upgrades (Optional)**: If the weapon has unique upgrades, add them to the `upgrades` array within the weapon's data object. You must specify the upgrade's name, cost, and any traits or critical effects it grants.
4.  **Run the Seed**: Reset the database to apply your changes.
    ```bash
    npx prisma migrate reset --force
    ```

### How It Connects

- A `StandardWeapon` is linked to its potential `WeaponUpgrade`s via the `StandardWeaponAvailableUpgrade` join table.
- A `WeaponTemplate` is linked to its included `StandardWeapon`s via the `WeaponTemplateStandardWeapon` join table.
- Finally, a `UnitTemplate` is linked to its available `WeaponTemplate`s (loadouts) via the `UnitTemplateWeaponTemplate` join table.

This layered approach allows for a high degree of control and reusability. You can define a `StandardWeapon` once and then use it in multiple `WeaponTemplate`s across different factions and units.
