# Super Admin Documentation

Welcome to the Super Admin documentation for the Fallout Factions Tracker. This section provides detailed guides for managing the global game assets that form the foundation of all campaigns.

As a Super Admin, your primary responsibility is to maintain the master list of all game elements. The entire system is designed around a data-seeding approach, meaning all core game rules, factions, and items are defined directly within the application's source code and loaded into the database. This ensures consistency, provides version control, and simplifies updates.

## Table of Contents

- **[Database Schema](../schema.md)**

  - A visual ERD diagram and detailed explanation of all data models and their relationships.

- **[Faction Management](./faction-management.md)**

  - An overview of how Factions are created and managed as master templates, including their dependencies on perks and other assets.

- **[Weapon & Upgrade Management](./weapon-management.md)**

  - A guide to the weapon system, explaining the roles of Standard Weapons, Weapon Upgrades, and Weapon Templates.

- **[Unit Template Management](./unittemplate-management.md)**
  - A detailed look at how Unit Templates are defined and how they bring together stats, classes, perks, and weapon loadouts to create character blueprints.
