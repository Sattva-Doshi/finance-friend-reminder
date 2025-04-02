
import * as React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface CategoryFieldProps {
  form: UseFormReturn<any>;
}

export function CategoryField({ form }: CategoryFieldProps) {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value || "other"}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="productivity">Productivity</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="food">Food & Dining</SelectItem>
              <SelectItem value="health">Health & Fitness</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="streaming">Streaming</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
