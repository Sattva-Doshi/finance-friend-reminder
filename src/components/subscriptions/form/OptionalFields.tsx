
import * as React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface OptionalFieldsProps {
  form: UseFormReturn<any>;
}

export function OptionalFields({ form }: OptionalFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website URL (optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="logo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logo URL (optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/logo.png" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
