
import React from "react";
import { Card } from "@/components/common/Card";
import { CompactCard } from "./card/CompactCard";
import { CardAmount } from "./card/CardAmount";
import { CardDetails } from "./card/CardDetails";
import { CardMenu } from "./card/CardMenu";
import { SubscriptionCardFooter } from "./card/CardFooter";
import { SubscriptionCardProps } from "./types";
import { Button } from "@/components/ui/button";
import { MailIcon } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";

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
  const { sendSubscriptionEmail, isLoading } = useNotifications();

  const handleCancel = () => {
    if (onCancel) {
      onCancel(id);
    }
  };

  const handleSendEmail = () => {
    sendSubscriptionEmail({
      id,
      name,
      amount,
      nextBillingDate
    });
  };

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
            {onCancel && <CardMenu onCancel={handleCancel} />}
          </div>
          <CardDetails
            billingCycle={billingCycle}
            category={category}
            amount={amount}
            nextBillingDate={nextBillingDate}
            inactive={inactive}
          />
        </div>
        <CardAmount amount={amount} billingCycle={billingCycle} />
      </div>
      
      <div className="px-4 pb-4">
        <Button
          className="w-full"
          size="sm"
          variant="secondary"
          onClick={handleSendEmail}
          disabled={isLoading || inactive}
        >
          <MailIcon className="h-4 w-4 mr-2" />
          Send Renewal Notification
        </Button>
      </div>
      
      <SubscriptionCardFooter
        website={website}
        inactive={inactive}
        onOpenWebsite={() => window.open(website, "_blank")}
      />
    </Card>
  );
}
