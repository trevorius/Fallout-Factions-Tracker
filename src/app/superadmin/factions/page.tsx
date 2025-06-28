import { prisma as db } from "@/lib/prisma";
import { FactionList } from "./_components/faction-list";

export default async function FactionsPage() {
  const factions = await db.faction.findMany({
    include: {
      unitTemplates: {
        include: {
          perks: true,
          weaponTemplates: {
            include: {
              weaponTemplate: {
                include: {
                  standardWeapons: {
                    include: {
                      standardWeapon: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  const unitClasses = await db.unitClass.findMany();
  const perks = await db.perk.findMany();
  const standardWeapons = await db.standardWeapon.findMany();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Factions</h1>
      <FactionList
        factions={factions}
        unitClasses={unitClasses}
        perks={perks}
        standardWeapons={standardWeapons}
      />
    </div>
  );
}
