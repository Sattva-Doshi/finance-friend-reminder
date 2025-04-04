
import { IndianRupeeIcon } from "lucide-react";
import React from "react";
import { CardAmountProps } from "../types";

export const CardAmount = ({ amount, billingCycle, compact = false }: CardAmountProps) => {
  if (compact) {
    return (
      <div className="text-right">
        <p className="text-lg font-semibold flex items-center justify-end">
          <IndianRupeeIcon className="h-3.5 w-3.5 mr-1" />
          {amount.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground">{billingCycle}</p>
      </div>
    );
  }

  return (
    <span className="text-2xl font-semibold flex items-center">
      <IndianRupeeIcon className="h-4 w-4 mr-1" />
      {amount.toFixed(2)}
    </span>
  );
};
