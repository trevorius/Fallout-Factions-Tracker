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
import { Perk, UnitClass, UnitTemplate } from "@prisma/client";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createUnitTemplate,
  updateUnitTemplate,
} from "../unit-template-actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormState } from "../types";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { MultiSelect, OptionType } from "@/components/ui-custom/multi-select";

interface UnitTemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitTemplate?: UnitTemplate & { perks: { perkId: string }[] };
  unitClass: UnitClass;
  factionId: string;
  perks: Perk[];
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? isEditing
          ? "Saving..."
          : "Creating..."
        : isEditing
        ? "Save Changes"
        : "Create Unit"}
    </Button>
  );
}

export function UnitTemplateFormDialog({
  open,
  onOpenChange,
  unitTemplate,
  unitClass,
  factionId,
  perks,
}: UnitTemplateFormDialogProps) {
  const action = unitTemplate
    ? updateUnitTemplate.bind(null, unitTemplate.id)
    : createUnitTemplate;

  const [state, formAction] = useActionState<FormState, FormData>(action, {
    message: "",
  });
  const { toast } = useToast();
  const router = useRouter();
  const [selectedPerks, setSelectedPerks] = useState<string[]>(
    unitTemplate?.perks.map((p) => p.perkId) || []
  );

  const perkOptions: OptionType[] = perks.map((perk) => ({
    value: perk.id,
    label: perk.name,
  }));

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.message,
        variant: state.message.startsWith("Error") ? "destructive" : "default",
      });
      if (!state.message.startsWith("Error")) {
        onOpenChange(false);
        router.refresh();
      }
    }
  }, [state, onOpenChange, toast, router]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {unitTemplate ? "Edit Unit" : `Create ${unitClass.name} Unit`}
          </DialogTitle>
          <DialogDescription>
            Define the base stats for this unit template.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) => {
            formData.append("perks", JSON.stringify(selectedPerks));
            formAction(formData);
          }}
        >
          <input type="hidden" name="factionId" value={factionId} />
          <input type="hidden" name="unitClassId" value={unitClass.id} />
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={unitTemplate?.name}
                required
              />
            </div>
            <div>
              <Label htmlFor="s">S</Label>
              <Input
                id="s"
                name="s"
                type="number"
                defaultValue={unitTemplate?.s}
                required
              />
            </div>
            <div>
              <Label htmlFor="p">P</Label>
              <Input
                id="p"
                name="p"
                type="number"
                defaultValue={unitTemplate?.p}
                required
              />
            </div>
            <div>
              <Label htmlFor="e">E</Label>
              <Input
                id="e"
                name="e"
                type="number"
                defaultValue={unitTemplate?.e}
                required
              />
            </div>
            <div>
              <Label htmlFor="c">C</Label>
              <Input
                id="c"
                name="c"
                type="number"
                defaultValue={unitTemplate?.c}
                required
              />
            </div>
            <div>
              <Label htmlFor="i">I</Label>
              <Input
                id="i"
                name="i"
                type="number"
                defaultValue={unitTemplate?.i}
                required
              />
            </div>
            <div>
              <Label htmlFor="a">A</Label>
              <Input
                id="a"
                name="a"
                type="number"
                defaultValue={unitTemplate?.a}
                required
              />
            </div>
            <div>
              <Label htmlFor="l">L</Label>
              <Input
                id="l"
                name="l"
                type="number"
                defaultValue={unitTemplate?.l}
                required
              />
            </div>
            <div>
              <Label htmlFor="hp">
                <Heart className="w-4 h-4 mr-1 my-1 text-red-500" />
              </Label>
              <Input
                id="hp"
                name="hp"
                type="number"
                defaultValue={unitTemplate?.hp}
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="perks">Perks</Label>
              <MultiSelect
                options={perkOptions}
                selected={selectedPerks}
                onChange={setSelectedPerks}
                placeholder="Select perks..."
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton isEditing={!!unitTemplate} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
