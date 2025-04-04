
import { Card, CardContent, CardHeader } from "@/components/common/Card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import React from "react";
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
  const { toast } = useToast();
  
  const handleOpenWebsite = () => {
    if (website) {
      window.open(website.startsWith('http') ? website : `https://${website}`, '_blank');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(id);
      toast({
        title: "Subscription canceled",
        description: `'${name}' has been canceled.`,
      });
    }
  };

  if (compact) {
    return (
      <CompactCard
        name={name}
        amount={amount}
        billingCycle={billingCycle}
        nextBillingDate={nextBillingDate}
        inactive={inactive}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "overflow-hidden",
        inactive && "opacity-60",
      )}>
        <CardHeader className="pb-2 relative">
          <div className={cn(
            "absolute inset-0 h-1",
            inactive ? "bg-muted" : "bg-primary"
          )} />
          <div className="flex justify-between items-center pt-3">
            <h3 className="font-medium text-base">{name}</h3>
            {!inactive && (
              <CardMenu onCancel={handleCancel} />
            )}
          </div>
        </CardHeader>
        <CardContent className="py-3">
          <CardDetails
            billingCycle={billingCycle}
            category={category}
            amount={amount}
            nextBillingDate={nextBillingDate}
            inactive={inactive}
          />
        </CardContent>
        
        <SubscriptionCardFooter
          website={website}
          inactive={inactive}
          onOpenWebsite={handleOpenWebsite}
        />
      </Card>
    </motion.div>
  );
}
