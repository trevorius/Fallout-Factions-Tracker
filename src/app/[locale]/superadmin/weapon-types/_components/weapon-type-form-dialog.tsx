"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActionState, useEffect } from "react";
import { createWeaponType, updateWeaponType } from "../actions";
import { SubmitButton } from "./submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WeaponType } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

interface WeaponTypeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  weaponType?: WeaponType;
}

export function WeaponTypeFormDialog({
  isOpen,
  onClose,
  weaponType,
}: WeaponTypeFormDialogProps) {
  const initialState = { message: null, errors: {} };
  const action = weaponType
    ? updateWeaponType.bind(null, weaponType.id)
    : createWeaponType;
  const [state, dispatch] = useActionState(action, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: state.message,
        });
        onClose();
      }
    }
  }, [state, toast, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {weaponType ? "Edit Weapon Type" : "Create Weapon Type"}
          </DialogTitle>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={weaponType?.name}
              required
            />
            {state.errors?.name && (
              <p className="text-red-500 text-xs">{state.errors.name}</p>
            )}
          </div>
          <SubmitButton>{weaponType ? "Update" : "Create"}</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
