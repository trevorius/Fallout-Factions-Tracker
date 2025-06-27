"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  isEditing: boolean;
}

export function SubmitButton({ isEditing }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? isEditing
          ? "Saving..."
          : "Creating..."
        : isEditing
        ? "Save changes"
        : "Create Critical Effect"}
    </Button>
  );
}
