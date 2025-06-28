-- DropForeignKey
ALTER TABLE "CrewChem" DROP CONSTRAINT "CrewChem_crewId_fkey";

-- DropForeignKey
ALTER TABLE "CrewQuest" DROP CONSTRAINT "CrewQuest_crewId_fkey";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_unitId_fkey";

-- DropForeignKey
ALTER TABLE "TemporaryHire" DROP CONSTRAINT "TemporaryHire_hiringCrewId_fkey";

-- DropForeignKey
ALTER TABLE "TemporaryHire" DROP CONSTRAINT "TemporaryHire_legendUnitId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_crewId_fkey";

-- DropForeignKey
ALTER TABLE "UnitInjury" DROP CONSTRAINT "UnitInjury_unitId_fkey";

-- DropForeignKey
ALTER TABLE "UnitPerk" DROP CONSTRAINT "UnitPerk_unitId_fkey";

-- DropForeignKey
ALTER TABLE "UnitWeapon" DROP CONSTRAINT "UnitWeapon_unitId_fkey";

-- DropForeignKey
ALTER TABLE "UnitWeaponAppliedUpgrade" DROP CONSTRAINT "UnitWeaponAppliedUpgrade_unitWeaponId_fkey";

-- DropForeignKey
ALTER TABLE "WastelandLegend" DROP CONSTRAINT "WastelandLegend_unitId_fkey";

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitInjury" ADD CONSTRAINT "UnitInjury_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitPerk" ADD CONSTRAINT "UnitPerk_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewChem" ADD CONSTRAINT "CrewChem_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewQuest" ADD CONSTRAINT "CrewQuest_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitWeapon" ADD CONSTRAINT "UnitWeapon_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitWeaponAppliedUpgrade" ADD CONSTRAINT "UnitWeaponAppliedUpgrade_unitWeaponId_fkey" FOREIGN KEY ("unitWeaponId") REFERENCES "UnitWeapon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WastelandLegend" ADD CONSTRAINT "WastelandLegend_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryHire" ADD CONSTRAINT "TemporaryHire_hiringCrewId_fkey" FOREIGN KEY ("hiringCrewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryHire" ADD CONSTRAINT "TemporaryHire_legendUnitId_fkey" FOREIGN KEY ("legendUnitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
