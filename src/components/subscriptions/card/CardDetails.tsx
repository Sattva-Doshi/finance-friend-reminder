
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="badge-muted">
            {getCategoryIcon(category)}
          </span>
          <span className="text-sm ml-2">{formatBillingCycle(billingCycle)}</span>
        </div>
        <span className="text-2xl font-semibold flex items-center">
          <IndianRupeeIcon className="h-4 w-4 mr-1" />
          {amount.toFixed(2)}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-muted-foreground">
          <CalendarIcon className="h-3.5 w-3.5 mr-1" />
          <span>
            {inactive 
              ? "Canceled" 
              : `Next payment: ${nextBillingDate.toLocaleDateString()}`
            }
          </span>
        </div>
        <span className="text-muted-foreground flex items-center">
          <IndianRupeeIcon className="h-3 w-3 mr-0.5" />
          {getMonthlyEquivalent(amount, billingCycle).toFixed(2)}/mo
        </span>
      </div>
    </>
  );
};
