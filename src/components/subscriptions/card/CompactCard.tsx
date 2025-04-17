
import { CalendarIcon, IndianRupeeIcon } from "lucide-react";
import { Card, CardContent } from "@/components/common/Card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";
import { getTimeRemaining, formatBillingCycle } from "../utils/billingUtils";
import { CompactCardProps } from "../types";

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
            <div className="text-right">
              <p className="text-lg font-semibold flex items-center justify-end">
                <IndianRupeeIcon className="h-3.5 w-3.5 mr-1" />
                {amount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">{formatBillingCycle(billingCycle)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
