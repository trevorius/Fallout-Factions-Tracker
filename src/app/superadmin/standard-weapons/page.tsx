import { prisma } from "@/lib/prisma";
import { StandardWeaponList } from "./_components/standard-weapon-list";

export default async function StandardWeaponsPage() {
  const standardWeapons = await prisma.standardWeapon.findMany({
    include: {
      weaponType: true,
      traits: { include: { trait: true } },
      criticalEffects: { include: { criticalEffect: true } },
    },
  });
  const weaponTypes = await prisma.weaponType.findMany();
  const traits = await prisma.trait.findMany();
  const criticalEffects = await prisma.criticalEffect.findMany();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Standard Weapons Management</h1>
      <StandardWeaponList
        standardWeapons={standardWeapons}
        weaponTypes={weaponTypes}
        traits={traits}
        criticalEffects={criticalEffects}
      />
    </div>
  );
}
