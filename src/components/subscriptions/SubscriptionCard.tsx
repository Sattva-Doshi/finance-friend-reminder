
import { CalendarIcon, CheckCircle2Icon, Clock3Icon, ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface SubscriptionCardProps {
  id: string;
  name: string;
  amount: number;
  billingCycle: "weekly" | "monthly" | "yearly";
  nextBillingDate: Date;
  logo: string;
  active: boolean;
  url?: string;
  onToggleActive?: (id: string) => void;
}

export default function SubscriptionCard({
  id,
  name,
  amount,
  billingCycle,
  nextBillingDate,
  logo,
  active,
  url,
  onToggleActive,
}: SubscriptionCardProps) {
  const { toast } = useToast();
  
  const formatBillingCycle = () => {
    switch (billingCycle) {
      case "weekly":
        return "week";
      case "monthly":
        return "month";
      case "yearly":
        return "year";
    }
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const diff = Math.ceil((nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleToggleActive = () => {
    if (onToggleActive) {
      onToggleActive(id);
      toast({
        title: active ? "Subscription paused" : "Subscription activated",
        description: `${name} has been ${active ? "paused" : "activated"}.`,
      });
    }
  };

  const handleOpenURL = () => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        !active && "opacity-60",
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {logo ? (
                <img src={logo} alt={name} className="h-8 w-8 mr-3 rounded object-contain" />
              ) : (
                <div className="h-8 w-8 mr-3 rounded bg-secondary flex items-center justify-center">
                  {name.charAt(0)}
                </div>
              )}
              <h3 className="font-medium text-base">{name}</h3>
            </div>
            <div>
              {active ? (
                <span className="badge-success">Active</span>
              ) : (
                <span className="badge-muted">Paused</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-semibold">${amount.toFixed(2)}</p>
              <div className="flex items-center">
                <RefreshCcwIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  per {formatBillingCycle()}
                </span>
              </div>
            </div>
            
            {active && (
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <Clock3Icon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Next billing in {getDaysRemaining()} days
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {nextBillingDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex gap-2">
          <Button 
            className="flex-1" 
            size="sm" 
            variant={active ? "outline" : "default"}
            onClick={handleToggleActive}
          >
            {active ? (
              <>Pause</>
            ) : (
              <>
                <CheckCircle2Icon className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </Button>
          {url && (
            <Button 
              className="flex-1" 
              size="sm" 
              variant="outline"
              onClick={handleOpenURL}
            >
              <ExternalLinkIcon className="h-4 w-4 mr-2" />
              Manage
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
