/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Faction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `StandardWeapon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `UnitClass` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `UnitTemplate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `WeaponTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Faction_name_key" ON "Faction"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StandardWeapon_name_key" ON "StandardWeapon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UnitClass_name_key" ON "UnitClass"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UnitTemplate_name_key" ON "UnitTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WeaponTemplate_name_key" ON "WeaponTemplate"("name");
