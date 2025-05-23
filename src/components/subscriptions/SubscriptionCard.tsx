
import React from "react";
import { Card } from "@/components/common/Card";
import { CompactCard } from "./card/CompactCard";
import { CardDetails } from "./card/CardDetails";
import { CardMenu } from "./card/CardMenu";
import { SubscriptionCardFooter } from "./card/CardFooter";
import { SubscriptionCardProps } from "./types";

export default function SubscriptionCard({
  id,
  name,
  amount,
  billingCycle,
  category,
  nextBillingDate,
  website,
  inactive = false,
  onCancel,
  compact = false,
}: SubscriptionCardProps) {
  if (compact) {
    return <CompactCard
      name={name}
      amount={amount}
      billingCycle={billingCycle}
      nextBillingDate={nextBillingDate}
      inactive={inactive}
    />;
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between p-4">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium mr-2">{name}</h3>
            {onCancel && <CardMenu onCancel={() => onCancel(id)} />}
          </div>
          <CardDetails
            billingCycle={billingCycle}
            category={category}
            amount={amount}
            nextBillingDate={nextBillingDate}
            inactive={inactive}
          />
        </div>
      </div>
      
      <SubscriptionCardFooter
        website={website}
        inactive={inactive}
        onOpenWebsite={() => window.open(website, "_blank")}
      />
    </Card>
  );
}
