import { prisma as db } from "@/lib/prisma";
import { CriticalEffectList } from "./_components/critical-effect-list";

export default async function CriticalEffectsPage() {
  const criticalEffects = await db.criticalEffect.findMany();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Critical Effects</h1>
      <CriticalEffectList criticalEffects={criticalEffects} />
    </div>
  );
}
