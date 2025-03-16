
import { CalendarIcon, CheckCircle2Icon, Clock10Icon, CreditCardIcon, DollarSignIcon, HomeIcon, InfoIcon, RefreshCcwIcon, ZapIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

type ReminderCategory = 
  | "credit-card" 
  | "subscription" 
  | "emi" 
  | "rent" 
  | "utility" 
  | "other";

type ReminderPriority = "high" | "medium" | "low";

interface ReminderCardProps {
  id: string;
  title: string;
  amount: number;
  dueDate: Date;
  category: ReminderCategory;
  paid: boolean;
  recurring: boolean;
  priority: ReminderPriority;
  onMarkPaid?: (id: string) => void;
  onSnooze?: (id: string) => void;
}

const priorityClasses = {
  high: "border-l-4 border-l-destructive",
  medium: "border-l-4 border-l-warning",
  low: "border-l-4 border-l-success",
};

export default function ReminderCard({
  id,
  title,
  amount,
  dueDate,
  category,
  paid,
  recurring,
  priority,
  onMarkPaid,
  onSnooze,
}: ReminderCardProps) {
  const { toast } = useToast();
  
  const getCategoryIcon = () => {
    switch (category) {
      case "credit-card":
        return <CreditCardIcon className="h-4 w-4" />;
      case "subscription":
        return <RefreshCcwIcon className="h-4 w-4" />;
      case "emi":
        return <DollarSignIcon className="h-4 w-4" />;
      case "rent":
        return <HomeIcon className="h-4 w-4" />;
      case "utility":
        return <ZapIcon className="h-4 w-4" />;
      default:
        return <InfoIcon className="h-4 w-4" />;
    }
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const diff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getDueStatusDisplay = () => {
    if (paid) return { text: "Paid", class: "text-success" };
    
    const days = getDaysRemaining();
    
    if (days < 0) return { text: "Overdue", class: "text-destructive" };
    if (days === 0) return { text: "Due today", class: "text-warning" };
    if (days === 1) return { text: "Due tomorrow", class: "text-warning" };
    return { text: `Due in ${days} days`, class: "text-muted-foreground" };
  };

  const dueStatus = getDueStatusDisplay();

  const handleMarkPaid = () => {
    if (onMarkPaid) {
      onMarkPaid(id);
      toast({
        title: "Marked as paid",
        description: `'${title}' has been marked as paid.`,
      });
    }
  };

  const handleSnooze = () => {
    if (onSnooze) {
      onSnooze(id);
      toast({
        title: "Reminder snoozed",
        description: `'${title}' has been snoozed for 1 day.`,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        priorityClasses[priority],
        paid && "opacity-60",
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-base">{title}</h3>
            <div className="flex gap-2">
              {recurring && (
                <span className="badge-primary">
                  <RefreshCcwIcon className="h-3 w-3 mr-1" />
                  Recurring
                </span>
              )}
              <span className="badge-muted">
                {getCategoryIcon()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-semibold">${amount.toFixed(2)}</p>
              <div className="flex items-center mt-1">
                <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className={cn("text-sm", dueStatus.class)}>
                  {dueStatus.text}
                </span>
              </div>
            </div>
            <div>
              {paid ? (
                <div className="rounded-full bg-success/10 p-2 text-success">
                  <CheckCircle2Icon className="h-6 w-6" />
                </div>
              ) : (
                <div className="rounded-full bg-muted p-2 text-muted-foreground">
                  <Clock10Icon className="h-6 w-6" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        {!paid && (
          <CardFooter className="pt-2 flex gap-2">
            <Button className="flex-1" size="sm" onClick={handleMarkPaid}>
              <CheckCircle2Icon className="h-4 w-4 mr-2" />
              Mark Paid
            </Button>
            <Button 
              className="flex-1" 
              size="sm" 
              variant="outline"
              onClick={handleSnooze}
            >
              Snooze
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
