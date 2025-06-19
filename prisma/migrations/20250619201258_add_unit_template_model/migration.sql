-- CreateTable
CREATE TABLE "UnitTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "s" INTEGER NOT NULL,
    "p" INTEGER NOT NULL,
    "e" INTEGER NOT NULL,
    "c" INTEGER NOT NULL,
    "i" INTEGER NOT NULL,
    "a" INTEGER NOT NULL,
    "l" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "factionId" TEXT NOT NULL,
    "unitClassId" TEXT NOT NULL,

    CONSTRAINT "UnitTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UnitTemplate" ADD CONSTRAINT "UnitTemplate_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTemplate" ADD CONSTRAINT "UnitTemplate_unitClassId_fkey" FOREIGN KEY ("unitClassId") REFERENCES "UnitClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
