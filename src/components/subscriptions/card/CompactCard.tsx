
import { CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/common/Card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";
import { getTimeRemaining } from "../utils/billingUtils";
import { CardAmount } from "./CardAmount";
import { formatBillingCycle } from "../utils/billingUtils";

interface CompactCardProps {
  name: string;
  amount: number;
  billingCycle: string;
  nextBillingDate: Date;
  inactive?: boolean;
}

export const CompactCard = ({
  name,
  amount,
  billingCycle,
  nextBillingDate,
  inactive = false
}: CompactCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "border-l-4",
        inactive && "opacity-60",
        inactive ? "border-l-muted" : "border-l-primary"
      )}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-base">{name}</h3>
              <div className="flex items-center mt-1">
                <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {inactive ? "Canceled" : getTimeRemaining(nextBillingDate)}
                </span>
              </div>
            </div>
            <CardAmount 
              amount={amount}
              billingCycle={formatBillingCycle(billingCycle)}
              compact={true}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
