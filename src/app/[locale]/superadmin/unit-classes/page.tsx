import { prisma as db } from "@/lib/prisma";
import { UnitClassList } from "./_components/unit-class-list";

export default async function UnitClassesPage() {
  const unitClasses = await db.unitClass.findMany();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Unit Classes</h1>
      <UnitClassList unitClasses={unitClasses} />
    </div>
  );
}
