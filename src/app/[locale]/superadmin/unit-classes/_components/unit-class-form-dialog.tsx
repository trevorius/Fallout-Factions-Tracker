"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UnitClass } from "@prisma/client";
import { useActionState, useEffect } from "react";
import { createUnitClass, updateUnitClass } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { FormState } from "../types";
import { SubmitButton } from "./submit-button";

interface UnitClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitClass?: UnitClass;
}

const initialState: FormState = {
  message: "",
};

export function UnitClassFormDialog({
  open,
  onOpenChange,
  unitClass,
}: UnitClassFormDialogProps) {
  const action = unitClass
    ? updateUnitClass.bind(null, unitClass.id)
    : createUnitClass;
  const [state, formAction] = useActionState(action, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.message,
        variant: state.message.startsWith("Error") ? "destructive" : "default",
      });
      if (!state.message.startsWith("Error")) {
        onOpenChange(false);
      }
    }
  }, [state, toast, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {unitClass ? "Edit Unit Class" : "Create Unit Class"}
          </DialogTitle>
          <DialogDescription>
            {unitClass
              ? "Edit the unit class name."
              : "Create a new unit class available for all organizations."}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={unitClass?.name}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton isEditing={!!unitClass} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
