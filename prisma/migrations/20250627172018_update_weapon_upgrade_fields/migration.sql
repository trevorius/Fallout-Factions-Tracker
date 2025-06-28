/*
  Warnings:

  - You are about to drop the column `ratingModifier` on the `WeaponUpgrade` table. All the data in the column will be lost.
  - You are about to drop the column `testValueModifier` on the `WeaponUpgrade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WeaponUpgrade" DROP COLUMN "ratingModifier",
DROP COLUMN "testValueModifier",
ADD COLUMN     "ratingNew" INTEGER,
ADD COLUMN     "testValueNew" INTEGER;
