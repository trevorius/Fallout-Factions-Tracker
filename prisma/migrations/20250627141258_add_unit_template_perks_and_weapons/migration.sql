/*
  Warnings:

  - You are about to drop the column `rating` on the `UnitTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UnitTemplate" DROP COLUMN "rating";

-- CreateTable
CREATE TABLE "UnitTemplatePerk" (
    "unitTemplateId" TEXT NOT NULL,
    "perkId" TEXT NOT NULL,

    CONSTRAINT "UnitTemplatePerk_pkey" PRIMARY KEY ("unitTemplateId","perkId")
);

-- CreateTable
CREATE TABLE "WeaponTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,

    CONSTRAINT "WeaponTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitTemplateWeaponTemplate" (
    "unitTemplateId" TEXT NOT NULL,
    "weaponTemplateId" TEXT NOT NULL,

    CONSTRAINT "UnitTemplateWeaponTemplate_pkey" PRIMARY KEY ("unitTemplateId","weaponTemplateId")
);

-- CreateTable
CREATE TABLE "WeaponTemplateStandardWeapon" (
    "weaponTemplateId" TEXT NOT NULL,
    "standardWeaponId" TEXT NOT NULL,

    CONSTRAINT "WeaponTemplateStandardWeapon_pkey" PRIMARY KEY ("weaponTemplateId","standardWeaponId")
);

-- AddForeignKey
ALTER TABLE "UnitTemplatePerk" ADD CONSTRAINT "UnitTemplatePerk_unitTemplateId_fkey" FOREIGN KEY ("unitTemplateId") REFERENCES "UnitTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTemplatePerk" ADD CONSTRAINT "UnitTemplatePerk_perkId_fkey" FOREIGN KEY ("perkId") REFERENCES "Perk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTemplateWeaponTemplate" ADD CONSTRAINT "UnitTemplateWeaponTemplate_unitTemplateId_fkey" FOREIGN KEY ("unitTemplateId") REFERENCES "UnitTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTemplateWeaponTemplate" ADD CONSTRAINT "UnitTemplateWeaponTemplate_weaponTemplateId_fkey" FOREIGN KEY ("weaponTemplateId") REFERENCES "WeaponTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponTemplateStandardWeapon" ADD CONSTRAINT "WeaponTemplateStandardWeapon_weaponTemplateId_fkey" FOREIGN KEY ("weaponTemplateId") REFERENCES "WeaponTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponTemplateStandardWeapon" ADD CONSTRAINT "WeaponTemplateStandardWeapon_standardWeaponId_fkey" FOREIGN KEY ("standardWeaponId") REFERENCES "StandardWeapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
