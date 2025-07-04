import { prisma as db } from "@/lib/prisma";
import { TraitList } from "./_components/trait-list";

export default async function TraitsPage() {
  const traits = await db.trait.findMany();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Weapon Traits</h1>
      <TraitList traits={traits} />
    </div>
  );
}
