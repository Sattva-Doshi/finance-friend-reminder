
import { CalendarIcon, CreditCardIcon, DollarSignIcon, LineChartIcon, PlusIcon, RefreshCwIcon, WalletIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { OverviewCard } from "@/components/dashboard/OverviewCard";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import ReminderCard from "@/components/reminders/ReminderCard";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent, CardHeader } from "@/components/common/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Mock data for the demo
const remindersMockData = [
  {
    id: "1",
    title: "Credit Card Bill",
    amount: 1250.00,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    category: "credit-card" as const,
    paid: false,
    recurring: true,
    priority: "high" as const,
  },
  {
    id: "2",
    title: "Netflix Subscription",
    amount: 15.99,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    category: "subscription" as const,
    paid: false,
    recurring: true,
    priority: "medium" as const,
  },
  {
    id: "3",
    title: "Home Loan EMI",
    amount: 1875.50,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    category: "emi" as const,
    paid: false,
    recurring: true,
    priority: "high" as const,
  },
];

const expenseChartData = [
  { name: "Jan", amount: 2500 },
  { name: "Feb", amount: 3200 },
  { name: "Mar", amount: 2800 },
  { name: "Apr", amount: 3100 },
  { name: "May", amount: 2900 },
  { name: "Jun", amount: 3500 },
];

export default function Index() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleMarkPaid = (id: string) => {
    toast({
      title: "Marked as paid",
      description: "The reminder has been marked as paid.",
    });
  };
  
  const handleSnooze = (id: string) => {
    toast({
      title: "Reminder snoozed",
      description: "The reminder has been snoozed for 1 day.",
    });
  };
  
  const goToReminders = () => {
    navigate('/reminders');
  };
  
  return (
    <PageTransition>
      <Navbar />
      <main className="page-container animate-fadeIn">
        <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
          </div>
          
          <Button className="space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>Add Reminder</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <OverviewCard 
            title="Total Balance"
            value="$8,250.00"
            icon={<WalletIcon className="h-5 w-5 text-primary" />}
            change={{ value: 3.2, isPositive: true }}
            trend="up"
          />
          
          <OverviewCard 
            title="Monthly Expenses"
            value="$3,250.00"
            icon={<LineChartIcon className="h-5 w-5 text-destructive" />}
            change={{ value: 1.5, isPositive: false }}
            trend="down"
          />
          
          <OverviewCard 
            title="Upcoming Bills"
            value="$2,145.50"
            icon={<CalendarIcon className="h-5 w-5 text-warning" />}
            change={{ value: 2.8, isPositive: false }}
            trend="neutral"
          />
          
          <OverviewCard 
            title="Subscriptions"
            value="$125.94"
            icon={<RefreshCwIcon className="h-5 w-5 text-accent" />}
            change={{ value: 0, isPositive: true }}
            trend="neutral"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ExpenseChart data={expenseChartData} />
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Upcoming Reminders</h3>
                <Button variant="ghost" size="sm" onClick={goToReminders}>
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {remindersMockData.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    {...reminder}
                    onMarkPaid={handleMarkPaid}
                    onSnooze={handleSnooze}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Expense Breakdown</h3>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="category">
                <TabsList className="mb-4">
                  <TabsTrigger value="category">By Category</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="category" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                        <span>Housing</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">$1,875.50</span>
                        <span className="text-muted-foreground ml-2 text-sm">(35%)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
                        <span>Food & Dining</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">$650.25</span>
                        <span className="text-muted-foreground ml-2 text-sm">(20%)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-warning mr-2"></div>
                        <span>Transportation</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">$325.00</span>
                        <span className="text-muted-foreground ml-2 text-sm">(10%)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                        <span>Entertainment</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">$227.50</span>
                        <span className="text-muted-foreground ml-2 text-sm">(7%)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground mr-2"></div>
                        <span>Other</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">$910.00</span>
                        <span className="text-muted-foreground ml-2 text-sm">(28%)</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="monthly" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                        <span>January</span>
                      </div>
                      <span className="font-medium">$2,500.00</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                        <span>February</span>
                      </div>
                      <span className="font-medium">$3,200.00</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                        <span>March</span>
                      </div>
                      <span className="font-medium">$2,800.00</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                        <span>April</span>
                      </div>
                      <span className="font-medium">$3,100.00</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                        <span>May</span>
                      </div>
                      <span className="font-medium">$2,900.00</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageTransition>
  );
}
