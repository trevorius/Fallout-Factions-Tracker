-- CreateEnum
CREATE TYPE "UnitStatus" AS ENUM ('ACTIVE', 'ABSENT', 'DEAD', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "SPECIAL" AS ENUM ('S', 'P', 'E', 'C', 'I', 'A', 'L');

-- AlterTable
ALTER TABLE "OrganizationMember" ADD COLUMN     "canPostMessages" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Crew" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "caps" INTEGER NOT NULL DEFAULT 0,
    "parts" INTEGER NOT NULL DEFAULT 0,
    "scout" INTEGER NOT NULL DEFAULT 0,
    "reach" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "tier" INTEGER NOT NULL DEFAULT 0,
    "power" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "factionId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Faction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "s" INTEGER NOT NULL,
    "p" INTEGER NOT NULL,
    "e" INTEGER NOT NULL,
    "c" INTEGER NOT NULL,
    "i" INTEGER NOT NULL,
    "a" INTEGER NOT NULL,
    "l" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "status" "UnitStatus" NOT NULL DEFAULT 'ACTIVE',
    "crewId" TEXT,
    "unitClassId" TEXT NOT NULL,
    "captorCrewId" TEXT,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitClass" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "UnitClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Injury" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,
    "specialAffected" "SPECIAL",
    "specialModifier" INTEGER,
    "causesAbsence" BOOLEAN NOT NULL DEFAULT false,
    "causesDeath" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Injury_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitInjury" (
    "unitId" TEXT NOT NULL,
    "injuryId" TEXT NOT NULL,

    CONSTRAINT "UnitInjury_pkey" PRIMARY KEY ("unitId","injuryId")
);

-- CreateTable
CREATE TABLE "Perk" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Perk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitPerk" (
    "unitId" TEXT NOT NULL,
    "perkId" TEXT NOT NULL,

    CONSTRAINT "UnitPerk_pkey" PRIMARY KEY ("unitId","perkId")
);

-- CreateTable
CREATE TABLE "Chem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "isRare" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Chem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewChem" (
    "crewId" TEXT NOT NULL,
    "chemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "CrewChem_pkey" PRIMARY KEY ("crewId","chemId")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tier" INTEGER NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewQuest" (
    "id" TEXT NOT NULL,
    "crewId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "target" INTEGER NOT NULL,

    CONSTRAINT "CrewQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandardWeapon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "range" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "testDice" INTEGER NOT NULL,
    "testAttribute" "SPECIAL" NOT NULL,
    "weaponTypeId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "StandardWeapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WeaponType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitWeapon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "range" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "testDice" INTEGER NOT NULL,
    "testAttribute" "SPECIAL" NOT NULL,
    "unitId" TEXT NOT NULL,
    "standardWeaponId" TEXT NOT NULL,

    CONSTRAINT "UnitWeapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponUpgrade" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rangeModifier" INTEGER NOT NULL DEFAULT 0,
    "costModifier" INTEGER NOT NULL DEFAULT 0,
    "testDiceModifier" INTEGER NOT NULL DEFAULT 0,
    "newTestAttribute" "SPECIAL",
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "WeaponUpgrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandardWeaponAvailableUpgrade" (
    "standardWeaponId" TEXT NOT NULL,
    "weaponUpgradeId" TEXT NOT NULL,

    CONSTRAINT "StandardWeaponAvailableUpgrade_pkey" PRIMARY KEY ("standardWeaponId","weaponUpgradeId")
);

-- CreateTable
CREATE TABLE "UnitWeaponAppliedUpgrade" (
    "unitWeaponId" TEXT NOT NULL,
    "weaponUpgradeId" TEXT NOT NULL,

    CONSTRAINT "UnitWeaponAppliedUpgrade_pkey" PRIMARY KEY ("unitWeaponId","weaponUpgradeId")
);

-- CreateTable
CREATE TABLE "Trait" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Trait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponTrait" (
    "unitWeaponId" TEXT NOT NULL,
    "traitId" TEXT NOT NULL,

    CONSTRAINT "WeaponTrait_pkey" PRIMARY KEY ("unitWeaponId","traitId")
);

-- CreateTable
CREATE TABLE "CriticalTrait" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "CriticalTrait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponCriticalTrait" (
    "unitWeaponId" TEXT NOT NULL,
    "criticalTraitId" TEXT NOT NULL,

    CONSTRAINT "WeaponCriticalTrait_pkey" PRIMARY KEY ("unitWeaponId","criticalTraitId")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignRule" (
    "id" TEXT NOT NULL,
    "maxNumberOfGamesAgainstSameCrew" INTEGER NOT NULL DEFAULT 0,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "CampaignRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WastelandLegend" (
    "id" TEXT NOT NULL,
    "isStandard" BOOLEAN NOT NULL DEFAULT false,
    "unitId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "WastelandLegend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationId" TEXT NOT NULL,
    "crewOneId" TEXT NOT NULL,
    "crewTwoId" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryHire" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "hiringCrewId" TEXT NOT NULL,
    "legendUnitId" TEXT NOT NULL,

    CONSTRAINT "TemporaryHire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Model_unitId_key" ON "Model"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignRule_organizationId_key" ON "CampaignRule"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "WastelandLegend_unitId_key" ON "WastelandLegend"("unitId");

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faction" ADD CONSTRAINT "Faction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_unitClassId_fkey" FOREIGN KEY ("unitClassId") REFERENCES "UnitClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_captorCrewId_fkey" FOREIGN KEY ("captorCrewId") REFERENCES "Crew"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitClass" ADD CONSTRAINT "UnitClass_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Injury" ADD CONSTRAINT "Injury_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitInjury" ADD CONSTRAINT "UnitInjury_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitInjury" ADD CONSTRAINT "UnitInjury_injuryId_fkey" FOREIGN KEY ("injuryId") REFERENCES "Injury"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perk" ADD CONSTRAINT "Perk_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitPerk" ADD CONSTRAINT "UnitPerk_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitPerk" ADD CONSTRAINT "UnitPerk_perkId_fkey" FOREIGN KEY ("perkId") REFERENCES "Perk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chem" ADD CONSTRAINT "Chem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewChem" ADD CONSTRAINT "CrewChem_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewChem" ADD CONSTRAINT "CrewChem_chemId_fkey" FOREIGN KEY ("chemId") REFERENCES "Chem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewQuest" ADD CONSTRAINT "CrewQuest_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewQuest" ADD CONSTRAINT "CrewQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardWeapon" ADD CONSTRAINT "StandardWeapon_weaponTypeId_fkey" FOREIGN KEY ("weaponTypeId") REFERENCES "WeaponType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardWeapon" ADD CONSTRAINT "StandardWeapon_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitWeapon" ADD CONSTRAINT "UnitWeapon_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitWeapon" ADD CONSTRAINT "UnitWeapon_standardWeaponId_fkey" FOREIGN KEY ("standardWeaponId") REFERENCES "StandardWeapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponUpgrade" ADD CONSTRAINT "WeaponUpgrade_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardWeaponAvailableUpgrade" ADD CONSTRAINT "StandardWeaponAvailableUpgrade_standardWeaponId_fkey" FOREIGN KEY ("standardWeaponId") REFERENCES "StandardWeapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardWeaponAvailableUpgrade" ADD CONSTRAINT "StandardWeaponAvailableUpgrade_weaponUpgradeId_fkey" FOREIGN KEY ("weaponUpgradeId") REFERENCES "WeaponUpgrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitWeaponAppliedUpgrade" ADD CONSTRAINT "UnitWeaponAppliedUpgrade_unitWeaponId_fkey" FOREIGN KEY ("unitWeaponId") REFERENCES "UnitWeapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitWeaponAppliedUpgrade" ADD CONSTRAINT "UnitWeaponAppliedUpgrade_weaponUpgradeId_fkey" FOREIGN KEY ("weaponUpgradeId") REFERENCES "WeaponUpgrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trait" ADD CONSTRAINT "Trait_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponTrait" ADD CONSTRAINT "WeaponTrait_unitWeaponId_fkey" FOREIGN KEY ("unitWeaponId") REFERENCES "UnitWeapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponTrait" ADD CONSTRAINT "WeaponTrait_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "Trait"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriticalTrait" ADD CONSTRAINT "CriticalTrait_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponCriticalTrait" ADD CONSTRAINT "WeaponCriticalTrait_unitWeaponId_fkey" FOREIGN KEY ("unitWeaponId") REFERENCES "UnitWeapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponCriticalTrait" ADD CONSTRAINT "WeaponCriticalTrait_criticalTraitId_fkey" FOREIGN KEY ("criticalTraitId") REFERENCES "CriticalTrait"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRule" ADD CONSTRAINT "CampaignRule_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "OrganizationMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WastelandLegend" ADD CONSTRAINT "WastelandLegend_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WastelandLegend" ADD CONSTRAINT "WastelandLegend_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_crewOneId_fkey" FOREIGN KEY ("crewOneId") REFERENCES "Crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_crewTwoId_fkey" FOREIGN KEY ("crewTwoId") REFERENCES "Crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryHire" ADD CONSTRAINT "TemporaryHire_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryHire" ADD CONSTRAINT "TemporaryHire_hiringCrewId_fkey" FOREIGN KEY ("hiringCrewId") REFERENCES "Crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryHire" ADD CONSTRAINT "TemporaryHire_legendUnitId_fkey" FOREIGN KEY ("legendUnitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
