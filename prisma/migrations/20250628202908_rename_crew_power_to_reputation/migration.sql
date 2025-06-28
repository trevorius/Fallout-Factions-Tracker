/*
  Warnings:

  - You are about to drop the column `power` on the `Crew` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Crew" DROP COLUMN "power",
ADD COLUMN     "reputation" INTEGER NOT NULL DEFAULT 0;
