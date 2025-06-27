/*
  Warnings:

  - You are about to drop the column `testAttribute` on the `StandardWeapon` table. All the data in the column will be lost.
  - You are about to drop the column `testDice` on the `StandardWeapon` table. All the data in the column will be lost.
  - You are about to drop the column `customName` on the `UnitWeapon` table. All the data in the column will be lost.
  - You are about to drop the column `standardWeaponId` on the `UnitWeapon` table. All the data in the column will be lost.
  - The primary key for the `WeaponCriticalEffect` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `WeaponTrait` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `damage` to the `StandardWeapon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rateOfFire` to the `StandardWeapon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `UnitWeapon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `damage` to the `UnitWeapon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `UnitWeapon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `range` to the `UnitWeapon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rateOfFire` to the `UnitWeapon` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `WeaponCriticalEffect` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `WeaponTrait` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "UnitWeapon" DROP CONSTRAINT "UnitWeapon_standardWeaponId_fkey";

-- DropForeignKey
ALTER TABLE "WeaponCriticalEffect" DROP CONSTRAINT "WeaponCriticalEffect_criticalEffectId_fkey";

-- DropForeignKey
ALTER TABLE "WeaponCriticalEffect" DROP CONSTRAINT "WeaponCriticalEffect_weaponId_fkey";

-- DropForeignKey
ALTER TABLE "WeaponTrait" DROP CONSTRAINT "WeaponTrait_traitId_fkey";

-- DropForeignKey
ALTER TABLE "WeaponTrait" DROP CONSTRAINT "WeaponTrait_weaponId_fkey";

-- DropIndex
DROP INDEX "UnitWeapon_standardWeaponId_idx";

-- DropIndex
DROP INDEX "UnitWeapon_unitId_idx";

-- AlterTable
ALTER TABLE "StandardWeapon" DROP COLUMN "testAttribute",
DROP COLUMN "testDice",
ADD COLUMN     "damage" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "rateOfFire" TEXT NOT NULL,
ALTER COLUMN "range" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UnitWeapon" DROP COLUMN "customName",
DROP COLUMN "standardWeaponId",
ADD COLUMN     "cost" INTEGER NOT NULL,
ADD COLUMN     "damage" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "range" TEXT NOT NULL,
ADD COLUMN     "rateOfFire" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WeaponCriticalEffect" DROP CONSTRAINT "WeaponCriticalEffect_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "WeaponCriticalEffect_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "WeaponTrait" DROP CONSTRAINT "WeaponTrait_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "WeaponTrait_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "WeaponCriticalEffect_weaponId_idx" ON "WeaponCriticalEffect"("weaponId");

-- CreateIndex
CREATE INDEX "WeaponCriticalEffect_criticalEffectId_idx" ON "WeaponCriticalEffect"("criticalEffectId");

-- CreateIndex
CREATE INDEX "WeaponTrait_weaponId_idx" ON "WeaponTrait"("weaponId");

-- CreateIndex
CREATE INDEX "WeaponTrait_traitId_idx" ON "WeaponTrait"("traitId");

-- AddForeignKey
ALTER TABLE "WeaponTrait" ADD CONSTRAINT "WeaponTrait_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "StandardWeapon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponTrait" ADD CONSTRAINT "WeaponTrait_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponCriticalEffect" ADD CONSTRAINT "WeaponCriticalEffect_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "StandardWeapon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponCriticalEffect" ADD CONSTRAINT "WeaponCriticalEffect_criticalEffectId_fkey" FOREIGN KEY ("criticalEffectId") REFERENCES "CriticalEffect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
