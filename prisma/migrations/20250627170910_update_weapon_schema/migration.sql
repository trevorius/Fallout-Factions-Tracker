/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `WeaponType` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "StandardWeapon" ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UnitWeapon" ADD COLUMN     "standardWeaponId" TEXT;

-- AlterTable
ALTER TABLE "WeaponUpgrade" ADD COLUMN     "costModifier" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "WeaponType_name_key" ON "WeaponType"("name");

-- AddForeignKey
ALTER TABLE "UnitWeapon" ADD CONSTRAINT "UnitWeapon_standardWeaponId_fkey" FOREIGN KEY ("standardWeaponId") REFERENCES "StandardWeapon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
