import { prisma } from "@/lib/prisma";
import { WeaponTypeList } from "./_components/weapon-type-list";

export default async function WeaponTypesPage() {
  const weaponTypes = await prisma.weaponType.findMany();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Weapon Types Management</h1>
      <WeaponTypeList weaponTypes={weaponTypes} />
    </div>
  );
}
