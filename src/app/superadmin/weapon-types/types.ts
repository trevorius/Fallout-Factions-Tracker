import { WeaponType } from "@prisma/client";

export type WeaponTypeDto = Omit<WeaponType, "id" | "createdAt" | "updatedAt">;

export type WeaponTypeState = {
  errors?: {
    name?: string[];
    _form?: string[];
  };
  message?: string | null;
};
