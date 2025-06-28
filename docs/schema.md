# Fallout Factions Tracker - Database Schema

This document provides a visual representation of the database schema for the Fallout Factions Tracker application. The diagram below is generated from the `prisma/schema.prisma` file and illustrates the relationships between all data models.

## Schema Diagram

```mermaid
erDiagram
    User {
        String id
        String name
        String email
        String salt
        String password
        Boolean isSuperAdmin
        DateTime createdAt
        DateTime updatedAt
    }
    Organization {
        String id
        String name
        String description
        DateTime createdAt
        DateTime updatedAt
    }
    OrganizationMember {
        String id
        String organizationId
        String userId
        OrganizationRole role
        Boolean canPostMessages
        DateTime createdAt
        DateTime updatedAt
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
        DateTime createdAt
        DateTime updatedAt
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
        Int hp
        UnitStatus status
        String crewId
        String unitClassId
        String captorCrewId
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
        SPECIAL specialAffected
        Int specialModifier
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
    PerkRequisite {
        String id
        SPECIAL special
        Int value
        String perkId
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
        String description
    }
    OrganizationChem {
        String organizationId
        String chemId
    }
    CrewChem {
        String crewId
        String chemId
    }
    Quest {
        String id
        String name
        String description
    }
    OrganizationQuest {
        String organizationId
        String questId
    }
    CrewQuest {
        String crewId
        String questId
    }
    StandardWeapon {
        String id
        String name
        String range
        SPECIAL testAttribute
        Int testValue
        Int rating
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
        String unitId
        String weaponTemplateId
    }
    WeaponUpgrade {
        String id
        String name
        String description
        Int cost
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
        String name
        String imageUrl
    }
    CampaignRule {
        String id
        String name
        String description
        String organizationId
    }
    Message {
        String id
        String content
        DateTime createdAt
        String organizationId
        String organizationMemberId
    }
    WastelandLegend {
        String id
        String name
        String organizationId
    }
    Game {
        String id
        DateTime date
        String scenario
        String notes
        String organizationId
        String crewOneId
        String crewTwoId
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
        Int cost
    }
    OrganizationWeaponTemplate {
        String organizationId
        String weaponTemplateId
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
    OrganizationUnitTemplate {
        String organizationId
        String unitTemplateId
    }

    User ||--o{ OrganizationMember : "organizations"
    User ||--o{ Crew : "crews"
    Organization ||--o{ OrganizationMember : "members"
    Organization ||--o{ Crew : "crews"
    Organization ||--o{ OrganizationFaction : "factions"
    Organization ||--o{ OrganizationUnitClass : "unitClasses"
    Organization ||--o{ OrganizationInjury : "injuries"
    Organization ||--o{ OrganizationPerk : "perks"
    Organization ||--o{ OrganizationChem : "chems"
    Organization ||--o{ OrganizationQuest : "quests"
    Organization ||--o{ OrganizationStandardWeapon : "standardWeapons"
    Organization ||--o{ OrganizationWeaponUpgrade : "weaponUpgrades"
    Organization ||--o{ OrganizationTrait : "traits"
    Organization ||--o{ OrganizationCriticalEffect : "criticalEffects"
    Organization ||--o{ OrganizationWeaponTemplate : "weaponTemplates"
    Organization ||--o{ OrganizationUnitTemplate : "unitTemplates"
    Organization ||--o{ WastelandLegend : "wastelandLegends"
    Organization ||--o{ Game : "games"
    Organization ||--o{ Unit : "units"
    Organization ||--o{ Message : "messages"
    Organization }o--|| CampaignRule : "campaignRule"
    OrganizationMember }o--|| User : "user"
    OrganizationMember }o--|| Organization : "organization"
    OrganizationMember ||--o{ Message : "messages"
    Crew }o--|| User : "user"
    Crew }o--|| Faction : "faction"
    Crew }o--|| Organization : "organization"
    Crew ||--o{ Unit : "units"
    Crew ||--o{ CrewQuest : "quests"
    Crew ||--o{ CrewChem : "chems"
    Crew ||--o{ TemporaryHire : "hiredLegends"
    Unit }o--|{ Crew : "capturedUnits"
    Game }o--|{ Crew : "gamesAsCrewOne"
    Game }o--|{ Crew : "gamesAsCrewTwo"
    Faction ||--o{ Crew : "crews"
    Faction ||--o{ OrganizationFaction : "organizations"
    Faction ||--o{ UnitTemplate : "unitTemplates"
    OrganizationFaction }o--|| Organization : "organization"
    OrganizationFaction }o--|| Faction : "faction"
    Unit }o--|| Crew : "crew"
    Unit }o--|| UnitClass : "unitClass"
    Unit }o--|| Organization : "organization"
    Unit ||--o{ UnitInjury : "injuries"
    Unit ||--o{ UnitPerk : "perks"
    Unit ||--o{ UnitWeapon : "weapons"
    Unit ||--o{ TemporaryHire : "hires"
    Unit }o--|{ Crew : "captorCrew"
    Unit }o--|| Model : "model"
    Unit }o--|| WastelandLegend : "legend"
    UnitClass ||--o{ Unit : "units"
    UnitClass ||--o{ OrganizationUnitClass : "organizations"
    UnitClass ||--o{ UnitTemplate : "unitTemplates"
    OrganizationUnitClass }o--|| Organization : "organization"
    OrganizationUnitClass }o--|| UnitClass : "unitClass"
    Injury ||--o{ UnitInjury : "units"
    Injury ||--o{ OrganizationInjury : "organizations"
    OrganizationInjury }o--|| Organization : "organization"
    OrganizationInjury }o--|| Injury : "injury"
    UnitInjury }o--|| Unit : "unit"
    UnitInjury }o--|| Injury : "injury"
    Perk ||--o{ UnitPerk : "units"
    Perk ||--o{ OrganizationPerk : "organizations"
    Perk ||--o{ UnitTemplatePerk : "unitTemplates"
    Perk }o--|| PerkRequisite : "requisite"
    PerkRequisite }o--|| Perk : "perk"
    OrganizationPerk }o--|| Organization : "organization"
    OrganizationPerk }o--|| Perk : "perk"
    UnitPerk }o--|| Unit : "unit"
    UnitPerk }o--|| Perk : "perk"
    Chem ||--o{ CrewChem : "crews"
    Chem ||--o{ OrganizationChem : "organizations"
    OrganizationChem }o--|| Organization : "organization"
    OrganizationChem }o--|| Chem : "chem"
    CrewChem }o--|| Crew : "crew"
    CrewChem }o--|| Chem : "chem"
    Quest ||--o{ CrewQuest : "crews"
    Quest ||--o{ OrganizationQuest : "organizations"
    OrganizationQuest }o--|| Organization : "organization"
    OrganizationQuest }o--|| Quest : "quest"
    CrewQuest }o--|| Crew : "crew"
    CrewQuest }o--|| Quest : "quest"
    StandardWeapon ||--o{ OrganizationStandardWeapon : "organizations"
    StandardWeapon ||--o{ StandardWeaponAvailableUpgrade : "availableUpgrades"
    StandardWeapon ||--o{ WeaponTemplateStandardWeapon : "weaponTemplates"
    StandardWeapon }o--|| WeaponType : "weaponType"
    OrganizationStandardWeapon }o--|| Organization : "organization"
    OrganizationStandardWeapon }o--|| StandardWeapon : "standardWeapon"
    WeaponType ||--o{ StandardWeapon : "standardWeapons"
    UnitWeapon }o--|| Unit : "unit"
    UnitWeapon }o--|| WeaponTemplate : "weaponTemplate"
    WeaponUpgrade ||--o{ OrganizationWeaponUpgrade : "organizations"
    WeaponUpgrade ||--o{ StandardWeaponAvailableUpgrade : "standardWeapons"
    WeaponUpgrade ||--o{ UnitWeaponAppliedUpgrade : "appliedTo"
    WeaponUpgrade ||--o{ WeaponUpgradeTrait : "traits"
    WeaponUpgrade ||--o{ WeaponUpgradeCritical : "criticalEffects"
    OrganizationWeaponUpgrade }o--|| Organization : "organization"
    OrganizationWeaponUpgrade }o--|| WeaponUpgrade : "weaponUpgrade"
    StandardWeaponAvailableUpgrade }o--|| StandardWeapon : "standardWeapon"
    StandardWeaponAvailableUpgrade }o--|| WeaponUpgrade : "weaponUpgrade"
    UnitWeaponAppliedUpgrade }o--|| UnitWeapon : "unitWeapon"
    UnitWeaponAppliedUpgrade }o--|| WeaponUpgrade : "weaponUpgrade"
    Trait ||--o{ OrganizationTrait : "organizations"
    Trait ||--o{ WeaponTrait : "weapons"
    Trait ||--o{ WeaponUpgradeTrait : "weaponUpgrades"
    OrganizationTrait }o--|| Organization : "organization"
    OrganizationTrait }o--|| Trait : "trait"
    WeaponTrait }o--|| StandardWeapon : "weapon"
    WeaponTrait }o--|| Trait : "trait"
    CriticalEffect ||--o{ OrganizationCriticalEffect : "organizations"
    CriticalEffect ||--o{ WeaponCriticalEffect : "weapons"
    CriticalEffect ||--o{ WeaponUpgradeCritical : "weaponUpgrades"
    OrganizationCriticalEffect }o--|| Organization : "organization"
    OrganizationCriticalEffect }o--|| CriticalEffect : "criticalEffect"
    WeaponCriticalEffect }o--|| StandardWeapon : "weapon"
    WeaponCriticalEffect }o--|| CriticalEffect : "criticalEffect"
    Model }o--|| Unit : "unit"
    CampaignRule }o--|| Organization : "organization"
    Message }o--|| Organization : "organization"
    Message }o--|| OrganizationMember : "author"
    WastelandLegend }o--|| Organization : "organization"
    WastelandLegend }o--|| Unit : "unit"
    Game }o--|| Organization : "organization"
    Game }o--|| Crew : "crewOne"
    Game }o--|| Crew : "crewTwo"
    TemporaryHire }o--|| Crew : "crew"
    TemporaryHire }o--|| Unit : "unit"
    UnitTemplate ||--o{ UnitTemplatePerk : "perks"
    UnitTemplate ||--o{ OrganizationUnitTemplate : "organizations"
    UnitTemplate ||--o{ UnitTemplateWeaponTemplate : "weaponTemplates"
    UnitTemplate }o--|| Faction : "faction"
    UnitTemplate }o--|| UnitClass : "unitClass"
    UnitTemplatePerk }o--|| UnitTemplate : "unitTemplate"
    UnitTemplatePerk }o--|| Perk : "perk"
    WeaponTemplate ||--o{ OrganizationWeaponTemplate : "organizations"
    WeaponTemplate ||--o{ UnitTemplateWeaponTemplate : "unitTemplates"
    WeaponTemplate ||--o{ WeaponTemplateStandardWeapon : "standardWeapons"
    WeaponTemplate ||--o{ UnitWeapon : "units"
    OrganizationWeaponTemplate }o--|| Organization : "organization"
    OrganizationWeaponTemplate }o--|| WeaponTemplate : "weaponTemplate"
    UnitTemplateWeaponTemplate }o--|| UnitTemplate : "unitTemplate"
    UnitTemplateWeaponTemplate }o--|| WeaponTemplate : "weaponTemplate"
    WeaponTemplateStandardWeapon }o--|| WeaponTemplate : "weaponTemplate"
    WeaponTemplateStandardWeapon }o--|| StandardWeapon : "standardWeapon"
    WeaponUpgradeTrait }o--|| WeaponUpgrade : "weaponUpgrade"
    WeaponUpgradeTrait }o--|| Trait : "trait"
    WeaponUpgradeCritical }o--|| WeaponUpgrade : "weaponUpgrade"
    WeaponUpgradeCritical }o--|| CriticalEffect : "criticalEffect"
    OrganizationUnitTemplate }o--|| Organization : "organization"
    OrganizationUnitTemplate }o--|| UnitTemplate : "unitTemplate"
}
```

## Data Models Explanation

### Core Models

- **User**: Represents a registered user. The `isSuperAdmin` flag grants access to global data management.
- **Organization**: The central hub for a gaming group or campaign. It contains all campaign-specific data and settings.
- **OrganizationMember**: A join table that connects a `User` to an `Organization` and assigns them a `role` (e.g., OWNER, ADMIN, USER).

### Game Asset & Template Management

The schema uses a layered approach to manage game assets. A **Super Admin** creates the global "master list" of items, and an **Organization Admin** selects which of these items are available for their specific campaign.

- **Master Lists (Super Admin)**: These are the global templates for all game assets, such as `Faction`, `UnitClass`, `Perk`, `StandardWeapon`, `WeaponUpgrade`, etc.
- **Availability Join Tables (Organization Admin)**: Tables like `OrganizationFaction`, `OrganizationPerk`, and `OrganizationStandardWeapon` create a many-to-many relationship. They don't store asset data themselves but simply link an `Organization` to the master list items, making them available within that campaign.

### Gameplay Models

- **Crew**: A player's team of units within an `Organization`. It belongs to a `User` and a `Faction`, and it tracks resources like `caps` and `xp`.
- **Unit**: A character within a `Crew`. It is based on a `UnitTemplate` and has stats (S.P.E.C.I.A.L.), hit points (`hp`), and a status.
- **UnitTemplate**: A blueprint for a unit, defining its base stats, `Faction`, and `UnitClass`. These are created by Super Admins.
- **WeaponTemplate**: A "loadout" or "package" that combines one or more `StandardWeapon`s at a set `cost`. These are linked to `UnitTemplate`s to define a unit's available equipment options.
- **StandardWeapon**: A base weapon with its own stats, `WeaponType`, and available `WeaponUpgrade`s.
- **WeaponUpgrade**: A modification that can be applied to a `StandardWeapon` to alter its characteristics.

This updated schema provides a more robust and scalable foundation for the application, clearly separating global game data from campaign-specific instances.

```

```
