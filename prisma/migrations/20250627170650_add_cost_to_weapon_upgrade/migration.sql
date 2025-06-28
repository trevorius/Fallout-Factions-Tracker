/*
  Warnings:

  - You are about to drop the column `costModifier` on the `WeaponUpgrade` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `WeaponUpgrade` table. All the data in the column will be lost.
  - You are about to drop the column `notesNew` on the `WeaponUpgrade` table. All the data in the column will be lost.
  - You are about to drop the column `rangeNew` on the `WeaponUpgrade` table. All the data in the column will be lost.
  - You are about to drop the column `testAttributeNew` on the `WeaponUpgrade` table. All the data in the column will be lost.
  - You are about to drop the column `testValueModifier` on the `WeaponUpgrade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WeaponUpgrade" DROP COLUMN "costModifier",
DROP COLUMN "description",
DROP COLUMN "notesNew",
DROP COLUMN "rangeNew",
DROP COLUMN "testAttributeNew",
DROP COLUMN "testValueModifier",
ADD COLUMN     "aModifier" INTEGER,
ADD COLUMN     "cModifier" INTEGER,
ADD COLUMN     "cost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "eModifier" INTEGER,
ADD COLUMN     "iModifier" INTEGER,
ADD COLUMN     "lModifier" INTEGER,
ADD COLUMN     "pModifier" INTEGER,
ADD COLUMN     "ratingModifier" INTEGER,
ADD COLUMN     "sModifier" INTEGER;
