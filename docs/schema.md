# Fallout Factions Tracker: Database Schema

This document outlines the database schema for the Fallout Factions Tracker application. The schema is designed to be flexible and extensible, allowing for future updates to the game rules.

## Schema Diagram

```mermaid
erDiagram
    User {
        String id
        String name
        String email
        Boolean isSuperAdmin
    }

    Organization {
        String id
        String name
    }

    OrganizationMember {
        String id
        String organizationId
        String userId
        String role
        Boolean canPostMessages
    }

    Crew {
        String id
        String name
        Int caps
        Int parts
        Int scout
        Int reach
        Int xp
        Int tier
        Int power
        String userId
        String factionId
        String organizationId
    }

    Faction {
        String id
        String name
    }

    OrganizationFaction {
        String organizationId
        String factionId
    }

    Unit {
        String id
        String name
        Int s
        Int p
        Int e
        Int c
        Int i
        Int a
        Int l
        Int rating
        String status
        String crewId "nullable"
        String unitClassId
        String captorCrewId "nullable"
        String organizationId
    }

    UnitClass {
        String id
        String name
    }

    OrganizationUnitClass {
        String organizationId
        String unitClassId
    }

    Injury {
        String id
        String name
        String description
        String specialAffected "nullable"
        Int specialModifier "nullable"
        Boolean causesAbsence
        Boolean causesDeath
    }

    OrganizationInjury {
        String organizationId
        String injuryId
    }

    UnitInjury {
        String unitId
        String injuryId
    }

    Perk {
        String id
        String name
        String description
    }

    OrganizationPerk {
        String organizationId
        String perkId
    }

    UnitPerk {
        String unitId
        String perkId
    }

    Chem {
        String id
        String name
        Int cost
        Boolean isRare
    }

    OrganizationChem {
        String organizationId
        String chemId
    }

    CrewChem {
        String crewId
        String chemId
        Int quantity
    }

    Quest {
        String id
        String name
        String description
        Int tier
    }

    OrganizationQuest {
        String organizationId
        String questId
    }

    CrewQuest {
        String id
        String crewId
        String questId
        Int progress
        Int target
    }

    StandardWeapon {
        String id
        String name
        Int range
        Int cost
        Int testDice
        String testAttribute
        String weaponTypeId
    }

    OrganizationStandardWeapon {
        String organizationId
        String standardWeaponId
    }

    WeaponType {
        String id
        String name
    }

    UnitWeapon {
        String id
        String name
        Int range
        Int cost
        Int testDice
        String testAttribute
        String unitId
        String standardWeaponId
    }

    WeaponUpgrade {
        String id
        String name
        String description
        Int rangeModifier
        Int costModifier
        Int testDiceModifier
        String newTestAttribute "nullable"
    }

    OrganizationWeaponUpgrade {
        String organizationId
        String weaponUpgradeId
    }

    StandardWeaponAvailableUpgrade {
        String standardWeaponId
        String weaponUpgradeId
    }

    UnitWeaponAppliedUpgrade {
        String unitWeaponId
        String weaponUpgradeId
    }

    Trait {
        String id
        String name
        String description
    }

    OrganizationTrait {
        String organizationId
        String traitId
    }

    WeaponTrait {
        String unitWeaponId
        String traitId
    }

    CriticalTrait {
        String id
        String name
        String description
    }

    OrganizationCriticalTrait {
        String organizationId
        String criticalTraitId
    }

    WeaponCriticalTrait {
        String unitWeaponId
        String criticalTraitId
    }

    Model {
        String id
        String description
        String unitId
    }

    Message {
        String id
        String title "nullable"
        String content
        Boolean isHidden
        String authorId
        String organizationId
        String parentId "nullable"
    }

    CampaignRule {
        String id
        Int maxNumberOfGamesAgainstSameCrew
        String organizationId
    }

    WastelandLegend {
        String id
        Boolean isStandard
        String unitId
        String organizationId
    }

    Game {
        String id
        String date
        String organizationId
        String crewOneId
        String crewTwoId
    }

    TemporaryHire {
        String id
        String gameId
        String hiringCrewId
        String legendUnitId
    }

    UnitTemplate {
        String id
        String name
        Int s
        Int p
        Int e
        Int c
        Int i
        Int a
        Int l
        Int rating
        String factionId
        String unitClassId
    }

    User ||--o{ OrganizationMember : "has"
    Organization ||--o{ OrganizationMember : "has"
    User ||--o{ Crew : "has"
    Organization ||--o{ Crew : "has"
    Crew ||--o{ Unit : "has"
    Organization ||--o{ Unit : "is home to"
    Faction ||--o{ Crew : "belongs to"
    UnitClass ||--o{ Unit : "is of class"

    Faction ||--o{ UnitTemplate : "defines templates for"
    UnitClass ||--o{ UnitTemplate : "categorizes"

    Organization ||--o{ OrganizationFaction : "selects"
    Faction ||--o{ OrganizationFaction : "is selected by"
    Organization ||--o{ OrganizationUnitClass : "selects"
    UnitClass ||--o{ OrganizationUnitClass : "is selected by"
    Organization ||--o{ OrganizationInjury : "selects"
    Injury ||--o{ OrganizationInjury : "is selected by"
    Organization ||--o{ OrganizationPerk : "selects"
    Perk ||--o{ OrganizationPerk : "is selected by"
    Organization ||--o{ OrganizationChem : "selects"
    Chem ||--o{ OrganizationChem : "is selected by"
    Organization ||--o{ OrganizationQuest : "selects"
    Quest ||--o{ OrganizationQuest : "is selected by"
    Organization ||--o{ OrganizationStandardWeapon : "selects"
    StandardWeapon ||--o{ OrganizationStandardWeapon : "is selected by"
    Organization ||--o{ OrganizationWeaponUpgrade : "selects"
    WeaponUpgrade ||--o{ OrganizationWeaponUpgrade : "is selected by"
    Organization ||--o{ OrganizationTrait : "selects"
    Trait ||--o{ OrganizationTrait : "is selected by"
    Organization ||--o{ OrganizationCriticalTrait : "selects"
    CriticalTrait ||--o{ OrganizationCriticalTrait : "is selected by"

    Crew ||..o{ Unit : "captures"
    Unit ||--o{ UnitInjury : "suffers"
    Injury ||--o{ UnitInjury : "is suffered by"
    Unit ||--o{ UnitPerk : "has"
    Perk ||--o{ UnitPerk : "is held by"
    Crew ||--o{ CrewChem : "has"
    Chem ||--o{ CrewChem : "is held by"
    Crew ||--o{ CrewQuest : "undertakes"
    Quest ||--o{ CrewQuest : "is undertaken by"
    Unit ||--o{ UnitWeapon : "wields"
    StandardWeapon ||--o{ UnitWeapon : "is instance of"
    WeaponType ||--o{ StandardWeapon : "is of type"
    StandardWeapon ||--o{ StandardWeaponAvailableUpgrade : "can have"
    WeaponUpgrade ||--o{ StandardWeaponAvailableUpgrade : "is"
    UnitWeapon ||--o{ UnitWeaponAppliedUpgrade : "has"
    WeaponUpgrade ||--o{ UnitWeaponAppliedUpgrade : "is"
    UnitWeapon ||--o{ WeaponTrait : "has"
    Trait ||--o{ WeaponTrait : ""
    UnitWeapon ||--o{ WeaponCriticalTrait : "has"
    CriticalTrait ||--o{ WeaponCriticalTrait : ""
    Unit ||--|| Model : "is represented by"
    Organization ||--|| CampaignRule : "has"
    Organization ||--o{ Message : "has"
    OrganizationMember ||--o{ Message : "is author of"
    Organization ||--o{ Game : "hosts"
    Crew ||--o{ Game : "is crew one in"
    Crew ||--o{ Game : "is crew two in"
    Game ||--o{ TemporaryHire : "has hires for"
    Crew ||--o{ TemporaryHire : "hires legend for"
    Unit ||--o{ TemporaryHire : "is hired for"
    Unit ||--|| WastelandLegend : "is"
    Organization ||--o{ WastelandLegend : "has"
}
```

## Data Models Explanation

### Core Models

- **User**: Represents a registered user in the system. Can be a Super Admin.
- **Organization**: Represents a gaming group or campaign. It is the central hub for all campaign-specific data.
- **OrganizationMember**: A join table connecting a `User` to an `Organization` with a specific `role`.

### Template & Join Models (Super Admin vs. Organization Admin)

The system distinguishes between "master list" items (created by a Super Admin) and the items available in a specific campaign (chosen by an Organization Admin).

- **Master Lists**: `Faction`, `UnitClass`, `UnitTemplate`, `Injury`, `Perk`, `Chem`, `Quest`, `StandardWeapon`, `WeaponUpgrade`, `Trait`, `CriticalTrait`. These are the global templates.
- **Join Tables**: `OrganizationFaction`, `OrganizationUnitClass`, etc. These tables create a many-to-many relationship, allowing an Organization Admin to select which master list items are available for their campaign.

### Game-Specific Models

- **Crew**: The central model for a player's team. It belongs to a `User` (player) and a `Faction`. It tracks resources like `caps`, `xp`, and `parts`.
- **Unit**: A member of a `Crew`. When a unit's status becomes `LEGENDARY`, its `crewId` is set to null, and it becomes a mercenary available for hire within its `Organization`.
- **Model**: Represents the single physical miniature for a `Unit`.
- **UnitTemplate**: Defines the base stats and class for a type of unit that belongs to a specific `Faction`. This serves as the blueprint from which player `Unit`s are created.

### Campaign & Gameplay Models

- **CampaignRule**: Special rules for an organization's campaign.
- **Message**: A post on the organization's message board.
- **WastelandLegend**: Marks a `Unit` as a legend. Can be a "standard" legend (created by a Super Admin) or a campaign-specific one.
- **Game**: A single game session played between two crews. This replaces the need for a `Rivalry` table.
- **TemporaryHire**: A contract to hire a legendary unit for a single `Game`.
- **CrewQuest**: Tracks a crew's progress on a `Quest`.

This schema is designed based on the provided information and should be implemented in `prisma/schema.prisma`.

```

```
