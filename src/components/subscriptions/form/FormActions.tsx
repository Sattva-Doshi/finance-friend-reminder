
import * as React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isEditing?: boolean;
}

export function FormActions({ onCancel, isEditing = false }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-4">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Update Subscription" : "Add Subscription"}
      </Button>
    </div>
  );
}
