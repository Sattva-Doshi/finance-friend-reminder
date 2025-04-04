
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionHeaderProps {
  onAddClick: () => void;
}

export function SubscriptionHeader({ onAddClick }: SubscriptionHeaderProps) {
  return (
    <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="page-title">Subscription Management</h1>
        <p className="text-muted-foreground">Track and manage your recurring subscriptions</p>
      </div>
      
      <Button className="space-x-2" onClick={onAddClick}>
        <PlusIcon className="h-4 w-4" />
        <span>Add Subscription</span>
      </Button>
    </div>
  );
}
