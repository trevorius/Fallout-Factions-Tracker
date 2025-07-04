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
import { Perk, PerkRequisite, SPECIAL } from "@prisma/client";
import { useActionState, useEffect } from "react";
import { createPerk, updatePerk } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { FormState } from "../types";
import { SubmitButton } from "./submit-button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type PerkWithRequisite = Perk & {
  requisite: PerkRequisite | null;
};

interface PerkFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  perk?: PerkWithRequisite;
}

const initialState: FormState = {
  message: "",
};

export function PerkFormDialog({
  open,
  onOpenChange,
  perk,
}: PerkFormDialogProps) {
  const action = perk ? updatePerk.bind(null, perk.id) : createPerk;
  const [state, formAction] = useActionState(action, initialState);
  const { toast } = useToast();
  const [hasRequisite, setHasRequisite] = useState(!!perk?.requisite);

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
          <DialogTitle>{perk ? "Edit Perk" : "Create Perk"}</DialogTitle>
          <DialogDescription>
            {perk
              ? "Edit the perk details."
              : "Create a new perk available for all organizations."}
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
              defaultValue={perk?.name}
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
              defaultValue={perk?.description || ""}
              className="col-span-3"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasRequisite"
              name="hasRequisite"
              checked={hasRequisite}
              onCheckedChange={(checked) => setHasRequisite(!!checked)}
            />
            <Label htmlFor="hasRequisite">Has Requisite</Label>
          </div>
          {hasRequisite && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="special" className="text-right">
                  SPECIAL
                </Label>
                <Select name="special" defaultValue={perk?.requisite?.special}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select SPECIAL" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SPECIAL).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  Value
                </Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  defaultValue={perk?.requisite?.value}
                  className="col-span-3"
                  required
                />
              </div>
            </>
          )}
          <DialogFooter>
            <SubmitButton isEditing={!!perk} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
