/*
  Warnings:

  - You are about to drop the column `cost` on the `UnitWeapon` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `UnitWeapon` table. All the data in the column will be lost.
  - You are about to drop the column `range` on the `UnitWeapon` table. All the data in the column will be lost.
  - You are about to drop the column `testAttribute` on the `UnitWeapon` table. All the data in the column will be lost.
  - You are about to drop the column `testDice` on the `UnitWeapon` table. All the data in the column will be lost.
  - The primary key for the `WeaponTrait` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `unitWeaponId` on the `WeaponTrait` table. All the data in the column will be lost.
  - You are about to drop the `CriticalTrait` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationCriticalTrait` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeaponCriticalTrait` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `weaponId` to the `WeaponTrait` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrganizationCriticalTrait" DROP CONSTRAINT "OrganizationCriticalTrait_criticalTraitId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationCriticalTrait" DROP CONSTRAINT "OrganizationCriticalTrait_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "WeaponCriticalTrait" DROP CONSTRAINT "WeaponCriticalTrait_criticalTraitId_fkey";

-- DropForeignKey
ALTER TABLE "WeaponCriticalTrait" DROP CONSTRAINT "WeaponCriticalTrait_unitWeaponId_fkey";

-- DropForeignKey
ALTER TABLE "WeaponTrait" DROP CONSTRAINT "WeaponTrait_unitWeaponId_fkey";

-- AlterTable
ALTER TABLE "UnitWeapon" DROP COLUMN "cost",
DROP COLUMN "name",
DROP COLUMN "range",
DROP COLUMN "testAttribute",
DROP COLUMN "testDice",
ADD COLUMN     "customName" TEXT;

-- AlterTable
ALTER TABLE "WeaponTrait" DROP CONSTRAINT "WeaponTrait_pkey",
DROP COLUMN "unitWeaponId",
ADD COLUMN     "weaponId" TEXT NOT NULL,
ADD CONSTRAINT "WeaponTrait_pkey" PRIMARY KEY ("weaponId", "traitId");

-- DropTable
DROP TABLE "CriticalTrait";

-- DropTable
DROP TABLE "OrganizationCriticalTrait";

-- DropTable
DROP TABLE "WeaponCriticalTrait";

-- CreateTable
CREATE TABLE "CriticalEffect" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CriticalEffect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationCriticalEffect" (
    "organizationId" TEXT NOT NULL,
    "criticalEffectId" TEXT NOT NULL,

    CONSTRAINT "OrganizationCriticalEffect_pkey" PRIMARY KEY ("organizationId","criticalEffectId")
);

-- CreateTable
CREATE TABLE "WeaponCriticalEffect" (
    "weaponId" TEXT NOT NULL,
    "criticalEffectId" TEXT NOT NULL,

    CONSTRAINT "WeaponCriticalEffect_pkey" PRIMARY KEY ("weaponId","criticalEffectId")
);

-- CreateIndex
CREATE INDEX "UnitWeapon_unitId_idx" ON "UnitWeapon"("unitId");

-- CreateIndex
CREATE INDEX "UnitWeapon_standardWeaponId_idx" ON "UnitWeapon"("standardWeaponId");

-- AddForeignKey
ALTER TABLE "WeaponTrait" ADD CONSTRAINT "WeaponTrait_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "UnitWeapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCriticalEffect" ADD CONSTRAINT "OrganizationCriticalEffect_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCriticalEffect" ADD CONSTRAINT "OrganizationCriticalEffect_criticalEffectId_fkey" FOREIGN KEY ("criticalEffectId") REFERENCES "CriticalEffect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponCriticalEffect" ADD CONSTRAINT "WeaponCriticalEffect_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "UnitWeapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponCriticalEffect" ADD CONSTRAINT "WeaponCriticalEffect_criticalEffectId_fkey" FOREIGN KEY ("criticalEffectId") REFERENCES "CriticalEffect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
