/*
  Warnings:

  - Added the required column `hp` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp` to the `UnitTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "hp" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UnitTemplate" ADD COLUMN     "hp" INTEGER NOT NULL;
