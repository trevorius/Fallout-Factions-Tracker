/*
  Warnings:

  - You are about to drop the column `damage` on the `StandardWeapon` table. All the data in the column will be lost.
  - Added the required column `testAttribute` to the `StandardWeapon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testValue` to the `StandardWeapon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StandardWeapon" DROP COLUMN "damage",
ADD COLUMN     "testAttribute" "SPECIAL" NOT NULL,
ADD COLUMN     "testValue" INTEGER NOT NULL;
