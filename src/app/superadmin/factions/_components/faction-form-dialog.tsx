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
import { Faction } from "@prisma/client";
import { useActionState, useEffect } from "react";
import { createFaction, updateFaction } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { FormState } from "../types";
import { SubmitButton } from "./submit-button";

interface FactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faction?: Faction;
}

const initialState: FormState = {
  message: "",
};

export function FactionFormDialog({
  open,
  onOpenChange,
  faction,
}: FactionFormDialogProps) {
  const action = faction ? updateFaction.bind(null, faction.id) : createFaction;
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
            {faction ? "Edit Faction" : "Create Faction"}
          </DialogTitle>
          <DialogDescription>
            {faction
              ? "Edit the faction name."
              : "Create a new faction available for all organizations."}
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
                defaultValue={faction?.name}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton isEditing={!!faction} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
