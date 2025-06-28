-- CreateTable
CREATE TABLE "OrganizationWeaponTemplate" (
    "organizationId" TEXT NOT NULL,
    "weaponTemplateId" TEXT NOT NULL,

    CONSTRAINT "OrganizationWeaponTemplate_pkey" PRIMARY KEY ("organizationId","weaponTemplateId")
);

-- AddForeignKey
ALTER TABLE "OrganizationWeaponTemplate" ADD CONSTRAINT "OrganizationWeaponTemplate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationWeaponTemplate" ADD CONSTRAINT "OrganizationWeaponTemplate_weaponTemplateId_fkey" FOREIGN KEY ("weaponTemplateId") REFERENCES "WeaponTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
