
import { CalendarIcon, IndianRupeeIcon } from "lucide-react";
import React from "react";
import { getCategoryIcon } from "../utils/categoryIcons";
import { formatBillingCycle, getMonthlyEquivalent } from "../utils/billingUtils";
import { CardDetailsProps } from "../types";

export const CardDetails = ({
  billingCycle,
  category,
  amount,
  nextBillingDate,
  inactive = false
}: CardDetailsProps) => {
  return (
    <>
      <div className="flex items-center mt-2 mb-4">
        <span className="badge-muted mr-2">
          {getCategoryIcon(category)}
        </span>
        <span className="text-sm">{formatBillingCycle(billingCycle)}</span>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl font-semibold flex items-center">
          <IndianRupeeIcon className="h-4 w-4 mr-1" />
          {amount.toFixed(2)}
        </span>
        <span className="text-sm text-muted-foreground flex items-center">
          <IndianRupeeIcon className="h-3 w-3 mr-0.5" />
          {getMonthlyEquivalent(amount, billingCycle).toFixed(2)}/mo
        </span>
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground">
        <CalendarIcon className="h-3.5 w-3.5 mr-1" />
        <span>
          {inactive 
            ? "Canceled" 
            : `Next payment: ${nextBillingDate.toLocaleDateString()}`
          }
        </span>
      </div>
    </>
  );
};
