
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCcwIcon, ArrowRightIcon, PlusIcon, IndianRupeeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SubscriptionCard from "@/components/subscriptions/SubscriptionCard";
import { SubscriptionType } from '@/lib/supabase';

interface UpcomingSubscriptionsProps {
  subscriptions: SubscriptionType[];
  onCancel: (id: string) => void;
}

export const UpcomingSubscriptions: React.FC<UpcomingSubscriptionsProps> = ({
  subscriptions,
  onCancel
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Upcoming Subscriptions</h2>
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/subscriptions')}>
          View all <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {subscriptions.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
            <RefreshCcwIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">No active subscriptions</p>
            <Button size="sm" variant="outline" onClick={() => navigate('/subscriptions')}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Subscription
            </Button>
          </div>
        ) : (
          subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              id={subscription.id || ""}
              name={subscription.name}
              amount={subscription.amount}
              billingCycle={subscription.billingCycle}
              category={subscription.category}
              nextBillingDate={new Date(subscription.nextBillingDate)}
              website={subscription.website}
              onCancel={onCancel}
              compact
            />
          ))
        )}
      </div>
    </div>
  );
}
