
import React from 'react';
import { BellIcon, CalendarIcon, DollarSignIcon, RefreshCcwIcon } from "lucide-react";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { ReminderType } from '@/lib/supabase';

interface DashboardOverviewProps {
  reminderCount: number;
  upcomingDueAmount: number;
  monthlyExpensesAmount: number;
  totalSubscriptionCost: number;
  currencySymbol?: string; // Added this property with optional flag
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  reminderCount,
  upcomingDueAmount,
  monthlyExpensesAmount,
  totalSubscriptionCost,
  currencySymbol = '$' // Default to $ if not provided
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <OverviewCard
        title="Upcoming Payments"
        value={reminderCount.toString()}
        icon={<BellIcon className="w-4 h-4" />}
        change={{ value: 0, isPositive: true }}
        trend="up"
      />
      <OverviewCard
        title="Due This Month"
        value={`${currencySymbol}${upcomingDueAmount.toFixed(2)}`}
        icon={<CalendarIcon className="w-4 h-4" />}
        change={{ value: 2.5, isPositive: false }}
        trend="down"
      />
      <OverviewCard
        title="Monthly Expenses"
        value={`${currencySymbol}${monthlyExpensesAmount.toFixed(2)}`}
        icon={<DollarSignIcon className="w-4 h-4" />}
        change={{ value: 12.3, isPositive: false }}
        trend="down"
      />
      <OverviewCard
        title="Subscriptions"
        value={`${currencySymbol}${totalSubscriptionCost.toFixed(2)}/mo`}
        icon={<RefreshCcwIcon className="w-4 h-4" />}
        change={{ value: 0, isPositive: true }}
        trend="neutral"
      />
    </div>
  );
};
