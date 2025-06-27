import { StandardWeapon } from "@prisma/client";

export type StandardWeaponDto = Omit<
  StandardWeapon,
  "id" | "createdAt" | "updatedAt"
>;

export type StandardWeaponState = {
  errors?: {
    name?: string[];
    range?: string[];
    testAttribute?: string[];
    testValue?: string[];
    notes?: string[];
    weaponTypeId?: string[];
    _form?: string[];
  };
  message?: string | null;
};
