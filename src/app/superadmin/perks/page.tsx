import { prisma as db } from "@/lib/prisma";
import { PerkList } from "./_components/perk-list";

export default async function PerksPage() {
  const perks = await db.perk.findMany({
    include: {
      requisite: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Perks</h1>
      <PerkList perks={perks} />
    </div>
  );
}
