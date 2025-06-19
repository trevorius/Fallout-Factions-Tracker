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
import { Prisma, UnitClass } from "@prisma/client";
import { useActionState, useEffect } from "react";
import { createFaction, updateFaction } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { FormState } from "../types";
import { SubmitButton } from "./submit-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { UnitTemplateFormDialog } from "./unit-template-form-dialog";
import { useState } from "react";
import { UnitTemplate } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteUnitTemplate } from "../unit-template-actions";
import { Heart } from "lucide-react";

type FactionWithTemplates = Prisma.FactionGetPayload<{
  include: { unitTemplates: true };
}>;

interface FactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faction?: FactionWithTemplates;
  unitClasses: UnitClass[];
}

const initialState: FormState = {
  message: "",
};

export function FactionFormDialog({
  open,
  onOpenChange,
  faction,
  unitClasses,
}: FactionFormDialogProps) {
  const action = faction ? updateFaction.bind(null, faction.id) : createFaction;
  const [state, formAction] = useActionState(action, initialState);
  const { toast } = useToast();

  const [unitTemplateDialogOpen, setUnitTemplateDialogOpen] = useState(false);
  const [selectedUnitTemplate, setSelectedUnitTemplate] = useState<
    UnitTemplate | undefined
  >(undefined);
  const [selectedUnitClass, setSelectedUnitClass] = useState<
    UnitClass | undefined
  >(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleAddUnit = (unitClass: UnitClass) => {
    setSelectedUnitTemplate(undefined);
    setSelectedUnitClass(unitClass);
    setUnitTemplateDialogOpen(true);
  };

  const handleEditUnit = (template: UnitTemplate, unitClass: UnitClass) => {
    setSelectedUnitTemplate(template);
    setSelectedUnitClass(unitClass);
    setUnitTemplateDialogOpen(true);
  };

  const handleDeleteUnit = (template: UnitTemplate) => {
    setSelectedUnitTemplate(template);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUnitTemplate) {
      const result = await deleteUnitTemplate(selectedUnitTemplate.id);
      toast({
        title: result.message,
        variant: result.message.startsWith("Error") ? "destructive" : "default",
      });
      setDeleteDialogOpen(false);
      setSelectedUnitTemplate(undefined);
    }
  };

  const templatesByClass = faction?.unitTemplates.reduce((acc, template) => {
    const key = template.unitClassId;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(template);
    return acc;
  }, {} as Record<string, FactionWithTemplates["unitTemplates"]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {faction ? "Edit Faction" : "Create Faction"}
          </DialogTitle>
          <DialogDescription>
            {faction
              ? "Edit the faction name and manage its unit roster."
              : "Create a new faction available for all organizations."}
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
              defaultValue={faction?.name}
              className="col-span-3"
              required
            />
          </div>

          {faction && (
            <div>
              <h3 className="text-lg font-medium mb-2">Unit Roster</h3>
              <Accordion type="multiple" className="w-full">
                {unitClasses.map((unitClass) => (
                  <AccordionItem key={unitClass.id} value={unitClass.id}>
                    <AccordionTrigger>{unitClass.name}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {templatesByClass?.[unitClass.id]?.map((template) => (
                          <div
                            key={template.id}
                            className="flex justify-between items-center p-2 border rounded"
                          >
                            <span>{template.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">
                                Rating: {template.rating}
                              </span>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Heart className="h-4 w-4 mr-1 text-red-500" />
                                {template.hp}
                              </div>
                              <div className="space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleEditUnit(template, unitClass)
                                  }
                                >
                                  Edit
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteUnit(template)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="secondary"
                          className="mt-2 w-full"
                          onClick={() => handleAddUnit(unitClass)}
                        >
                          Add {unitClass.name} Unit
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          <DialogFooter>
            <SubmitButton isEditing={!!faction} />
          </DialogFooter>
        </form>
        {selectedUnitClass && faction && (
          <UnitTemplateFormDialog
            key={selectedUnitTemplate?.id || "create"}
            open={unitTemplateDialogOpen}
            onOpenChange={setUnitTemplateDialogOpen}
            unitClass={selectedUnitClass}
            unitTemplate={selectedUnitTemplate}
            factionId={faction.id}
          />
        )}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                unit template from this faction.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
