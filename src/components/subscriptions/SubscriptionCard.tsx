
import { CalendarIcon, CheckCircle2Icon, CreditCardIcon, ExternalLinkIcon, InfoIcon, LaptopIcon, MoreVerticalIcon, MusicIcon, PanelTopIcon, ShoppingBagIcon, TvIcon, XIcon, ZapIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface SubscriptionCardProps {
  id: string;
  name: string;
  amount: number;
  billingCycle: string;
  category: string;
  nextBillingDate: Date;
  website?: string;
  inactive?: boolean;
  onCancel?: (id: string) => void;
  compact?: boolean;
}

// Function to format billing cycle for display
const formatBillingCycle = (cycle: string) => {
  switch (cycle) {
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    case "quarterly":
      return "Quarterly";
    case "biannually":
      return "Bi-annually";
    case "yearly":
      return "Yearly";
    default:
      return cycle;
  }
};

// Calculate normalized monthly cost
const getMonthlyEquivalent = (amount: number, cycle: string) => {
  switch (cycle) {
    case "weekly":
      return amount * 4.33; // Average weeks in a month
    case "monthly":
      return amount;
    case "quarterly":
      return amount / 3;
    case "biannually":
      return amount / 6;
    case "yearly":
      return amount / 12;
    default:
      return amount;
  }
};

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
  
  const getCategoryIcon = () => {
    switch (category) {
      case "entertainment":
        return <TvIcon className="h-4 w-4" />;
      case "productivity":
        return <LaptopIcon className="h-4 w-4" />;
      case "utilities":
        return <ZapIcon className="h-4 w-4" />;
      case "food":
        return <ShoppingBagIcon className="h-4 w-4" />;
      case "music":
        return <MusicIcon className="h-4 w-4" />;
      case "streaming":
        return <PanelTopIcon className="h-4 w-4" />;
      default:
        return <InfoIcon className="h-4 w-4" />;
    }
  };

  const getTimeRemaining = () => {
    const today = new Date();
    const diff = Math.ceil((nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return "Overdue";
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff < 7) return `In ${diff} days`;
    if (diff < 14) return "Next week";
    return `In ${diff} days`;
  };

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
                    {inactive ? "Canceled" : getTimeRemaining()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">${amount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{formatBillingCycle(billingCycle)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCancel}>Cancel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="py-3">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span className="badge-muted">
                {getCategoryIcon()}
              </span>
              <span className="text-sm ml-2">{formatBillingCycle(billingCycle)}</span>
            </div>
            <span className="text-2xl font-semibold">${amount.toFixed(2)}</span>
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
            <span className="text-muted-foreground">
              ~${getMonthlyEquivalent(amount, billingCycle).toFixed(2)}/mo
            </span>
          </div>
        </CardContent>
        {website && !inactive && (
          <CardFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleOpenWebsite}
            >
              <ExternalLinkIcon className="h-3.5 w-3.5 mr-2" />
              Visit Website
            </Button>
          </CardFooter>
        )}
        
        {inactive && (
          <CardFooter className="pt-2 pb-4">
            <div className="w-full flex items-center justify-center text-sm text-muted-foreground">
              <XIcon className="h-3.5 w-3.5 mr-1.5" />
              <span>Subscription canceled</span>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
