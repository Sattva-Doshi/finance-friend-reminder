
import { SearchIcon, FilterIcon } from "lucide-react";
import { Card, CardContent } from "@/components/common/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubscriptionType } from "@/lib/supabase";

interface SubscriptionStatsCardProps {
  subscriptions: SubscriptionType[];
  totalMonthlyCost: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SubscriptionStatsCard({ 
  subscriptions, 
  totalMonthlyCost, 
  searchQuery, 
  onSearchChange 
}: SubscriptionStatsCardProps) {
  const getNextPaymentDate = () => {
    if (subscriptions.length > 0 && subscriptions.some(s => s.active)) {
      return new Date(
        Math.min(
          ...subscriptions
            .filter(s => s.active)
            .map(s => new Date(s.nextBillingDate).getTime())
        )
      ).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
    return 'N/A';
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Active Subscriptions</span>
              <span className="text-3xl font-semibold">{subscriptions.filter(s => s.active).length}</span>
            </div>
            <div className="h-12 w-px bg-border hidden md:block"></div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Monthly Cost</span>
              <span className="text-3xl font-semibold">₹{totalMonthlyCost.toFixed(2)}</span>
            </div>
            <div className="h-12 w-px bg-border hidden md:block"></div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Next Payment</span>
              <span className="text-3xl font-semibold">{getNextPaymentDate()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search subscriptions..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Button variant="outline" className="space-x-2">
              <FilterIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
