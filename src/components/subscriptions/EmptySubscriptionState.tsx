
import { CreditCardIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptySubscriptionStateProps {
  category?: string;
  onAddClick: () => void;
}

export function EmptySubscriptionState({ category = "", onAddClick }: EmptySubscriptionStateProps) {
  const categoryText = category ? `${category}` : "";
  
  return (
    <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
      <CreditCardIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">
        No {categoryText} {categoryText ? "subscriptions" : "active subscriptions"}
      </h3>
      <p className="text-muted-foreground mb-6">
        {category
          ? `Add your first ${categoryText.toLowerCase()} subscription.`
          : "Add your first subscription to start tracking recurring payments."}
      </p>
      <Button onClick={onAddClick}>
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Subscription
      </Button>
    </div>
  );
}
