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
        String name "unique"
        String description "nullable"
    }

    PerkRequisite {
        String id
        String perkId "unique"
        SPECIAL special
        Int value
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
        String name "unique"
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
        String range
        String testAttribute
        Int testValue
        String notes "nullable"
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
        String range
        Int cost
        Int testDice
        String testAttribute
        String unitId
        String standardWeaponId
    }

    WeaponUpgrade {
        String id
        String name
        String description "nullable"
        Int costModifier "nullable"
        String rangeNew "nullable"
        String testAttributeNew "nullable"
        Int testValueModifier "nullable"
        String notesNew "nullable"
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
        String weaponId
        String traitId
    }

    CriticalEffect {
        String id
        String name
        String description
    }

    OrganizationCriticalEffect {
        String organizationId
        String criticalEffectId
    }

    WeaponCriticalEffect {
        String weaponId
        String criticalEffectId
    }

    Model {
        String id
        String description
        String unitId
    }

    Message {
        String id
        String content
        String userId
        String organizationId
    }

    WastelandLegend {
        String id
        String name
        String organizationId
    }

    Game {
        String id
        String status
        String crewOneId
        String crewTwoId
        String organizationId
    }

    TemporaryHire {
        String id
        String crewId
        String unitId
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
        Int hp
        String factionId
        String unitClassId
    }

    UnitTemplatePerk {
        String unitTemplateId
        String perkId
    }

    WeaponTemplate {
        String id
        String name
    }

    UnitTemplateWeaponTemplate {
        String unitTemplateId
        String weaponTemplateId
    }

    WeaponTemplateStandardWeapon {
        String weaponTemplateId
        String standardWeaponId
    }

    WeaponUpgradeTrait {
        String weaponUpgradeId
        String traitId
    }

    WeaponUpgradeCritical {
        String weaponUpgradeId
        String criticalEffectId
    }

    User ||--o{ OrganizationMember : "has"
    Organization ||--o{ OrganizationMember : "has"
    Organization ||--o{ Crew : "has"
    User ||--o{ Crew : "has"
    Faction ||--o{ Crew : "has"
    Organization ||--o{ OrganizationFaction : "has"
    Faction ||--o{ OrganizationFaction : "has"
    Crew ||--o{ Unit : "has"
    UnitClass ||--o{ Unit : "has"
    Organization ||--o{ Unit : "has"
    Organization ||--o{ OrganizationUnitClass : "has"
    UnitClass ||--o{ OrganizationUnitClass : "has"
    Unit ||--o{ UnitInjury : "has"
    Injury ||--o{ UnitInjury : "has"
    Organization ||--o{ OrganizationInjury : "has"
    Injury ||--o{ OrganizationInjury : "has"
    Unit ||--o{ UnitPerk : "has"
    Perk ||--o{ UnitPerk : "has"
    Perk ||--o{ PerkRequisite : "has"
    Organization ||--o{ OrganizationPerk : "has"
    Perk ||--o{ OrganizationPerk : "has"
    Crew ||--o{ CrewChem : "has"
    Chem ||--o{ CrewChem : "has"
    Organization ||--o{ OrganizationChem : "has"
    Chem ||--o{ OrganizationChem : "has"
    Crew ||--o{ CrewQuest : "has"
    Quest ||--o{ CrewQuest : "has"
    Organization ||--o{ OrganizationQuest : "has"
    Quest ||--o{ OrganizationQuest : "has"
    WeaponType ||--o{ StandardWeapon : "has"
    Organization ||--o{ OrganizationStandardWeapon : "has"
    StandardWeapon ||--o{ OrganizationStandardWeapon : "has"
    StandardWeapon ||--o{ UnitWeapon : "has"
    Unit ||--o{ UnitWeapon : "has"
    UnitWeapon ||--o{ UnitWeaponAppliedUpgrade : "has"
    WeaponUpgrade ||--o{ UnitWeaponAppliedUpgrade : "has"
    StandardWeapon ||--o{ StandardWeaponAvailableUpgrade : "has"
    WeaponUpgrade ||--o{ StandardWeaponAvailableUpgrade : "has"
    Organization ||--o{ OrganizationWeaponUpgrade : "has"
    WeaponUpgrade ||--o{ OrganizationWeaponUpgrade : "has"
    Trait ||--o{ WeaponTrait : "has"
    UnitWeapon ||--o{ WeaponTrait : "has"
    Organization ||--o{ OrganizationTrait : "has"
    Trait ||--o{ OrganizationTrait : "has"
    CriticalEffect ||--o{ WeaponCriticalEffect : "has"
    UnitWeapon ||--o{ WeaponCriticalEffect : "has"
    Organization ||--o{ OrganizationCriticalEffect : "has"
    CriticalEffect ||--o{ OrganizationCriticalEffect : "has"
    Unit ||--o{ Model : "has"
    User ||--o{ Message : "has"
    Organization ||--o{ Message : "has"
    Organization ||--o{ WastelandLegend : "has"
    Organization ||--o{ Game : "has"
    Crew ||--o{ Game : "has"
    Unit ||--o{ TemporaryHire : "has"
    Faction ||--o{ UnitTemplate : "has"
    UnitClass ||--o{ UnitTemplate : "has"
    UnitTemplate ||--o{ UnitTemplatePerk : "has"
    Perk ||--o{ UnitTemplatePerk : "has"
    UnitTemplate ||--o{ UnitTemplateWeaponTemplate : "has"
    WeaponTemplate ||--o{ UnitTemplateWeaponTemplate : "has"
    WeaponTemplate ||--o{ WeaponTemplateStandardWeapon : "has"
    StandardWeapon ||--o{ WeaponTemplateStandardWeapon : "has"
    WeaponUpgrade ||--o{ WeaponUpgradeTrait : "has"
    Trait ||--o{ WeaponUpgradeTrait : "has"
    WeaponUpgrade ||--o{ WeaponUpgradeCritical : "has"
    CriticalEffect ||--o{ WeaponUpgradeCritical : "has"
}
```

## Data Models Explanation

### Core Models

- **User**: Represents a registered user in the system. Can be a Super Admin.
- **Organization**: Represents a gaming group or campaign. It is the central hub for all campaign-specific data.
- **OrganizationMember**: A join table connecting a `User` to an `Organization` with a specific `role`.

### Template & Join Models (Super Admin vs. Organization Admin)

The system distinguishes between "master list" items (created by a Super Admin) and the items available in a specific campaign (chosen by an Organization Admin).

- **Master Lists**: `Faction`, `UnitClass`, `UnitTemplate`, `Injury`, `Perk`, `Chem`, `Quest`, `StandardWeapon`, `WeaponUpgrade`, `Trait`, `CriticalEffect`. These are the global templates.
- **Join Tables**: `OrganizationFaction`, `OrganizationUnitClass`, etc. These tables create a many-to-many relationship, allowing an Organization Admin to select which master list items are available for their campaign.

### Game-Specific Models

- **Crew**: The central model for a player's team. It belongs to a `User` (player) and a `Faction`. It tracks resources like `caps`, `xp`, and `parts`.
- **Unit**: A member of a `Crew`. When a unit's status becomes `LEGENDARY`, its `crewId` is set to null, and it becomes a mercenary available for hire within its `Organization`.
- **Model**: Represents the single physical miniature for a `Unit`.
- **UnitTemplate**: Defines the base stats, class, and HP for a type of unit that belongs to a specific `Faction`. This serves as the blueprint from which player `Unit`s are created.

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
