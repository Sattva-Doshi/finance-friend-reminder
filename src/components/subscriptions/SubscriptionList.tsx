
import { SubscriptionType } from "@/lib/supabase";
import SubscriptionCard from "./SubscriptionCard";
import { EmptySubscriptionState } from "./EmptySubscriptionState";

interface SubscriptionListProps {
  subscriptions: SubscriptionType[];
  category?: string;
  isLoading: boolean;
  onCancelSubscription?: (id: string) => void;
  onAddClick: () => void;
  inactive?: boolean;
}

export function SubscriptionList({ 
  subscriptions, 
  category,
  isLoading, 
  onCancelSubscription,
  onAddClick,
  inactive = false
}: SubscriptionListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <span>Loading subscriptions...</span>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <EmptySubscriptionState 
        category={category} 
        onAddClick={onAddClick}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          id={subscription.id || ""}
          name={subscription.name}
          amount={subscription.amount}
          billingCycle={subscription.billingCycle}
          category={subscription.category}
          nextBillingDate={new Date(subscription.nextBillingDate)}
          website={subscription.website}
          inactive={inactive}
          onCancel={onCancelSubscription}
        />
      ))}
    </div>
  );
}
