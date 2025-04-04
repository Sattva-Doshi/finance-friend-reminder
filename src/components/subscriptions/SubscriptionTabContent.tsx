
import { TabsContent } from "@/components/ui/tabs";
import { SubscriptionList } from "./SubscriptionList";
import { SubscriptionType } from "@/lib/supabase";

interface SubscriptionTabContentProps {
  value: string;
  subscriptions: SubscriptionType[];
  isLoading: boolean;
  onCancelSubscription?: (id: string) => void;
  onAddClick: () => void;
  isInactiveTab?: boolean;
}

export function SubscriptionTabContent({
  value,
  subscriptions,
  isLoading,
  onCancelSubscription,
  onAddClick,
  isInactiveTab = false,
}: SubscriptionTabContentProps) {
  return (
    <TabsContent value={value} className="mt-6">
      <SubscriptionList 
        subscriptions={subscriptions}
        category={value !== "all" && value !== "inactive" ? value : undefined}
        isLoading={isLoading}
        onCancelSubscription={!isInactiveTab ? onCancelSubscription : undefined}
        onAddClick={onAddClick}
        inactive={isInactiveTab}
      />
    </TabsContent>
  );
}
