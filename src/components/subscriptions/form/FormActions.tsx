
import * as React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
}

export function FormActions({ onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-4">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">Add Subscription</Button>
    </div>
  );
}
