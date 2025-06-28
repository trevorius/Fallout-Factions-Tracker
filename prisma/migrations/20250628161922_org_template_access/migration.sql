-- CreateTable
CREATE TABLE "OrganizationUnitTemplate" (
    "organizationId" TEXT NOT NULL,
    "unitTemplateId" TEXT NOT NULL,

    CONSTRAINT "OrganizationUnitTemplate_pkey" PRIMARY KEY ("organizationId","unitTemplateId")
);

-- AddForeignKey
ALTER TABLE "OrganizationUnitTemplate" ADD CONSTRAINT "OrganizationUnitTemplate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationUnitTemplate" ADD CONSTRAINT "OrganizationUnitTemplate_unitTemplateId_fkey" FOREIGN KEY ("unitTemplateId") REFERENCES "UnitTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
