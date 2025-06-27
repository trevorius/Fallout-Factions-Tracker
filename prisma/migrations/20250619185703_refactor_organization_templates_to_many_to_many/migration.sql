/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Chem` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `CriticalTrait` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Faction` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Injury` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Perk` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Quest` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `StandardWeapon` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Trait` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `UnitClass` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `WeaponUpgrade` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chem" DROP CONSTRAINT "Chem_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "CriticalTrait" DROP CONSTRAINT "CriticalTrait_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Faction" DROP CONSTRAINT "Faction_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Injury" DROP CONSTRAINT "Injury_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Perk" DROP CONSTRAINT "Perk_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Quest" DROP CONSTRAINT "Quest_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "StandardWeapon" DROP CONSTRAINT "StandardWeapon_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Trait" DROP CONSTRAINT "Trait_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UnitClass" DROP CONSTRAINT "UnitClass_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "WeaponUpgrade" DROP CONSTRAINT "WeaponUpgrade_organizationId_fkey";

-- AlterTable
ALTER TABLE "Chem" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "CriticalTrait" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Faction" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Injury" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Perk" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Quest" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "StandardWeapon" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Trait" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "UnitClass" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "WeaponUpgrade" DROP COLUMN "organizationId";

-- CreateTable
CREATE TABLE "OrganizationFaction" (
    "organizationId" TEXT NOT NULL,
    "factionId" TEXT NOT NULL,

    CONSTRAINT "OrganizationFaction_pkey" PRIMARY KEY ("organizationId","factionId")
);

-- CreateTable
CREATE TABLE "OrganizationUnitClass" (
    "organizationId" TEXT NOT NULL,
    "unitClassId" TEXT NOT NULL,

    CONSTRAINT "OrganizationUnitClass_pkey" PRIMARY KEY ("organizationId","unitClassId")
);

-- CreateTable
CREATE TABLE "OrganizationInjury" (
    "organizationId" TEXT NOT NULL,
    "injuryId" TEXT NOT NULL,

    CONSTRAINT "OrganizationInjury_pkey" PRIMARY KEY ("organizationId","injuryId")
);

-- CreateTable
CREATE TABLE "OrganizationPerk" (
    "organizationId" TEXT NOT NULL,
    "perkId" TEXT NOT NULL,

    CONSTRAINT "OrganizationPerk_pkey" PRIMARY KEY ("organizationId","perkId")
);

-- CreateTable
CREATE TABLE "OrganizationChem" (
    "organizationId" TEXT NOT NULL,
    "chemId" TEXT NOT NULL,

    CONSTRAINT "OrganizationChem_pkey" PRIMARY KEY ("organizationId","chemId")
);

-- CreateTable
CREATE TABLE "OrganizationQuest" (
    "organizationId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,

    CONSTRAINT "OrganizationQuest_pkey" PRIMARY KEY ("organizationId","questId")
);

-- CreateTable
CREATE TABLE "OrganizationStandardWeapon" (
    "organizationId" TEXT NOT NULL,
    "standardWeaponId" TEXT NOT NULL,

    CONSTRAINT "OrganizationStandardWeapon_pkey" PRIMARY KEY ("organizationId","standardWeaponId")
);

-- CreateTable
CREATE TABLE "OrganizationWeaponUpgrade" (
    "organizationId" TEXT NOT NULL,
    "weaponUpgradeId" TEXT NOT NULL,

    CONSTRAINT "OrganizationWeaponUpgrade_pkey" PRIMARY KEY ("organizationId","weaponUpgradeId")
);

-- CreateTable
CREATE TABLE "OrganizationTrait" (
    "organizationId" TEXT NOT NULL,
    "traitId" TEXT NOT NULL,

    CONSTRAINT "OrganizationTrait_pkey" PRIMARY KEY ("organizationId","traitId")
);

-- CreateTable
CREATE TABLE "OrganizationCriticalTrait" (
    "organizationId" TEXT NOT NULL,
    "criticalTraitId" TEXT NOT NULL,

    CONSTRAINT "OrganizationCriticalTrait_pkey" PRIMARY KEY ("organizationId","criticalTraitId")
);

-- AddForeignKey
ALTER TABLE "OrganizationFaction" ADD CONSTRAINT "OrganizationFaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationFaction" ADD CONSTRAINT "OrganizationFaction_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationUnitClass" ADD CONSTRAINT "OrganizationUnitClass_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationUnitClass" ADD CONSTRAINT "OrganizationUnitClass_unitClassId_fkey" FOREIGN KEY ("unitClassId") REFERENCES "UnitClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationInjury" ADD CONSTRAINT "OrganizationInjury_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationInjury" ADD CONSTRAINT "OrganizationInjury_injuryId_fkey" FOREIGN KEY ("injuryId") REFERENCES "Injury"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationPerk" ADD CONSTRAINT "OrganizationPerk_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationPerk" ADD CONSTRAINT "OrganizationPerk_perkId_fkey" FOREIGN KEY ("perkId") REFERENCES "Perk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationChem" ADD CONSTRAINT "OrganizationChem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationChem" ADD CONSTRAINT "OrganizationChem_chemId_fkey" FOREIGN KEY ("chemId") REFERENCES "Chem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationQuest" ADD CONSTRAINT "OrganizationQuest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationQuest" ADD CONSTRAINT "OrganizationQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationStandardWeapon" ADD CONSTRAINT "OrganizationStandardWeapon_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationStandardWeapon" ADD CONSTRAINT "OrganizationStandardWeapon_standardWeaponId_fkey" FOREIGN KEY ("standardWeaponId") REFERENCES "StandardWeapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationWeaponUpgrade" ADD CONSTRAINT "OrganizationWeaponUpgrade_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationWeaponUpgrade" ADD CONSTRAINT "OrganizationWeaponUpgrade_weaponUpgradeId_fkey" FOREIGN KEY ("weaponUpgradeId") REFERENCES "WeaponUpgrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationTrait" ADD CONSTRAINT "OrganizationTrait_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationTrait" ADD CONSTRAINT "OrganizationTrait_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "Trait"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCriticalTrait" ADD CONSTRAINT "OrganizationCriticalTrait_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCriticalTrait" ADD CONSTRAINT "OrganizationCriticalTrait_criticalTraitId_fkey" FOREIGN KEY ("criticalTraitId") REFERENCES "CriticalTrait"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
