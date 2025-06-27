/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Chem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Perk` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "PerkRequisite" (
    "id" TEXT NOT NULL,
    "perkId" TEXT NOT NULL,
    "special" "SPECIAL" NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "PerkRequisite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PerkRequisite_perkId_key" ON "PerkRequisite"("perkId");

-- CreateIndex
CREATE UNIQUE INDEX "Chem_name_key" ON "Chem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Perk_name_key" ON "Perk"("name");

-- AddForeignKey
ALTER TABLE "PerkRequisite" ADD CONSTRAINT "PerkRequisite_perkId_fkey" FOREIGN KEY ("perkId") REFERENCES "Perk"("id") ON DELETE CASCADE ON UPDATE CASCADE;
