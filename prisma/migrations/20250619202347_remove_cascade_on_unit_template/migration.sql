-- DropForeignKey
ALTER TABLE "UnitTemplate" DROP CONSTRAINT "UnitTemplate_factionId_fkey";

-- AddForeignKey
ALTER TABLE "UnitTemplate" ADD CONSTRAINT "UnitTemplate_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
