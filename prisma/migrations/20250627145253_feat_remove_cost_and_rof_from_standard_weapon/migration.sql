/*
  Warnings:

  - You are about to drop the column `cost` on the `StandardWeapon` table. All the data in the column will be lost.
  - You are about to drop the column `rateOfFire` on the `StandardWeapon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StandardWeapon" DROP COLUMN "cost",
DROP COLUMN "rateOfFire";
