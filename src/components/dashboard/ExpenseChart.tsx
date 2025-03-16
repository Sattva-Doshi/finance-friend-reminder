
import { Card, CardContent, CardHeader } from "@/components/common/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

interface ExpenseChartProps {
  data: Array<{
    name: string;
    amount: number;
  }>;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border rounded-lg shadow-lg p-2 text-sm backdrop-blur-sm">
        <p className="font-medium">{label}</p>
        <p className="text-primary">
          ${payload[0].value?.toFixed(2)}
        </p>
      </div>
    );
  }

  return null;
};

export default function ExpenseChart({ data, className }: ExpenseChartProps) {
  return (
    <Card className={cn("h-[400px]", className)}>
      <CardHeader>
        <h3 className="text-lg font-medium">Monthly Expenses</h3>
        <p className="text-sm text-muted-foreground">Overview of your spending trends</p>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} />
            <Bar 
              dataKey="amount" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
