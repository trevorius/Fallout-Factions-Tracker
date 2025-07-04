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
import { Trait } from "@prisma/client";
import { useActionState, useEffect } from "react";
import { createTrait, updateTrait } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { FormState } from "../types";
import { SubmitButton } from "./submit-button";
import { Textarea } from "@/components/ui/textarea";

interface TraitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trait?: Trait;
}

const initialState: FormState = {
  message: "",
};

export function TraitFormDialog({
  open,
  onOpenChange,
  trait,
}: TraitFormDialogProps) {
  const action = trait ? updateTrait.bind(null, trait.id) : createTrait;
  const [state, formAction] = useActionState(action, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.message,
        variant: state.message.startsWith("Error") ? "destructive" : "default",
      });
      if (
        !state.message.startsWith("Error") &&
        !state.message.includes("update")
      ) {
        onOpenChange(false);
      }
    }
  }, [state, toast, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{trait ? "Edit Trait" : "Create Trait"}</DialogTitle>
          <DialogDescription>
            {trait
              ? "Edit the trait details."
              : "Create a new trait available for all organizations."}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={trait?.name}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={trait?.description || ""}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <SubmitButton isEditing={!!trait} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
