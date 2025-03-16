
import { HTMLAttributes, forwardRef } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/common/Card";

interface OverviewCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  trend?: "up" | "down" | "neutral";
}

const OverviewCard = forwardRef<HTMLDivElement, OverviewCardProps>(
  ({ className, title, value, icon, change, trend = "neutral", ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn("animate-fadeIn", className)}
        {...props}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="rounded-full p-2 bg-secondary/50">{icon}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-semibold">{value}</h4>
              {change && (
                <div className="flex items-center mt-1">
                  {change.isPositive ? (
                    <ArrowUpIcon className="w-4 h-4 text-success mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-destructive mr-1" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      change.isPositive ? "text-success" : "text-destructive"
                    )}
                  >
                    {Math.abs(change.value)}%
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    from last month
                  </span>
                </div>
              )}
            </div>

            {trend && (
              <div className={cn(
                "h-10 w-16 flex items-end",
                trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"
              )}>
                {/* Simple trend visualization */}
                <div className="bg-current h-2 w-1 mx-0.5 rounded-t-sm opacity-30"></div>
                <div className="bg-current h-3 w-1 mx-0.5 rounded-t-sm opacity-40"></div>
                <div className="bg-current h-5 w-1 mx-0.5 rounded-t-sm opacity-60"></div>
                <div className="bg-current h-4 w-1 mx-0.5 rounded-t-sm opacity-50"></div>
                <div className={cn(
                  "bg-current w-1 mx-0.5 rounded-t-sm",
                  trend === "up" ? "h-8" : trend === "down" ? "h-2" : "h-5"
                )}></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);
OverviewCard.displayName = "OverviewCard";

export { OverviewCard };
