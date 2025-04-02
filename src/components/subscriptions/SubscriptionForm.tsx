
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { BillingFields } from "./form/BillingFields";
import { CategoryField } from "./form/CategoryField";
import { OptionalFields } from "./form/OptionalFields";
import { FormActions } from "./form/FormActions";
import { formSchema, FormValues } from "./form/subscriptionFormSchema";

interface SubscriptionFormProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

export function SubscriptionForm({ onSubmit, onCancel }: SubscriptionFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
      billingCycle: "monthly",
      nextBillingDate: new Date(),
      category: "other",
      website: "",
      logo: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-6">
          <BasicInfoFields form={form} />
          <BillingFields form={form} />
          <CategoryField form={form} />
          <OptionalFields form={form} />
        </div>
        <FormActions onCancel={onCancel} />
      </form>
    </Form>
  );
}
