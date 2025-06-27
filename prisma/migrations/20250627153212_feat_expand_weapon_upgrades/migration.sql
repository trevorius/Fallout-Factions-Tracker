/*
  Warnings:

  - You are about to drop the column `newTestAttribute` on the `WeaponUpgrade` table. All the data in the column will be lost.
  - You are about to drop the column `rangeModifier` on the `WeaponUpgrade` table. All the data in the column will be lost.
  - You are about to drop the column `testDiceModifier` on the `WeaponUpgrade` table. All the data in the column will be lost.
  - Added the required column `traitId` to the `OrganizationWeaponUpgrade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrganizationWeaponUpgrade" ADD COLUMN     "traitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trait" ADD COLUMN     "cost" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WeaponUpgrade" DROP COLUMN "newTestAttribute",
DROP COLUMN "rangeModifier",
DROP COLUMN "testDiceModifier",
ADD COLUMN     "notesNew" TEXT,
ADD COLUMN     "rangeNew" TEXT,
ADD COLUMN     "testAttributeNew" "SPECIAL",
ADD COLUMN     "testValueModifier" INTEGER,
ALTER COLUMN "costModifier" DROP NOT NULL,
ALTER COLUMN "costModifier" DROP DEFAULT;

-- CreateTable
CREATE TABLE "WeaponUpgradeTrait" (
    "id" TEXT NOT NULL,
    "weaponUpgradeId" TEXT NOT NULL,
    "traitId" TEXT NOT NULL,

    CONSTRAINT "WeaponUpgradeTrait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponUpgradeCritical" (
    "id" TEXT NOT NULL,
    "weaponUpgradeId" TEXT NOT NULL,
    "criticalEffectId" TEXT NOT NULL,

    CONSTRAINT "WeaponUpgradeCritical_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeaponUpgradeTrait_weaponUpgradeId_idx" ON "WeaponUpgradeTrait"("weaponUpgradeId");

-- CreateIndex
CREATE INDEX "WeaponUpgradeTrait_traitId_idx" ON "WeaponUpgradeTrait"("traitId");

-- CreateIndex
CREATE INDEX "WeaponUpgradeCritical_weaponUpgradeId_idx" ON "WeaponUpgradeCritical"("weaponUpgradeId");

-- CreateIndex
CREATE INDEX "WeaponUpgradeCritical_criticalEffectId_idx" ON "WeaponUpgradeCritical"("criticalEffectId");

-- CreateIndex
CREATE INDEX "OrganizationWeaponUpgrade_weaponUpgradeId_idx" ON "OrganizationWeaponUpgrade"("weaponUpgradeId");

-- CreateIndex
CREATE INDEX "OrganizationWeaponUpgrade_traitId_idx" ON "OrganizationWeaponUpgrade"("traitId");

-- AddForeignKey
ALTER TABLE "WeaponUpgradeTrait" ADD CONSTRAINT "WeaponUpgradeTrait_weaponUpgradeId_fkey" FOREIGN KEY ("weaponUpgradeId") REFERENCES "WeaponUpgrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponUpgradeTrait" ADD CONSTRAINT "WeaponUpgradeTrait_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponUpgradeCritical" ADD CONSTRAINT "WeaponUpgradeCritical_weaponUpgradeId_fkey" FOREIGN KEY ("weaponUpgradeId") REFERENCES "WeaponUpgrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponUpgradeCritical" ADD CONSTRAINT "WeaponUpgradeCritical_criticalEffectId_fkey" FOREIGN KEY ("criticalEffectId") REFERENCES "CriticalEffect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
