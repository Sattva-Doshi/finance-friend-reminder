import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import ReminderCard from "@/components/reminders/ReminderCard";
import SubscriptionCard from "@/components/subscriptions/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { CreditCardIcon, ArrowRightIcon, BellIcon, CalendarIcon, DollarSignIcon, PlusIcon, RefreshCcwIcon } from "lucide-react";
import { useReminders } from "@/hooks/use-reminders";
import { useExpenses } from "@/hooks/use-expenses";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useAuth } from "@/hooks/use-auth";

export default function Index() {
  const navigate = useNavigate();
  const { reminders, markReminderPaid, snoozeReminder } = useReminders();
  const { expenses, getMonthlyExpenseData } = useExpenses();
  const { subscriptions, cancelSubscription, getTotalMonthlyCost } = useSubscriptions();
  const { user, isLoading } = useAuth(true);

  // Get upcoming reminders (not paid and due within 7 days)
  const upcomingReminders = reminders
    .filter(reminder => !reminder.paid)
    .filter(reminder => {
      const dueDate = new Date(reminder.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // Get recent expenses (last 3)
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Get upcoming subscriptions (next 3 billing dates)
  const upcomingSubscriptions = subscriptions
    .filter(sub => sub.active)
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 3);

  // Get monthly expense data for chart
  const chartData = getMonthlyExpenseData();

  // Calculate total upcoming due amount
  const upcomingDueAmount = reminders
    .filter(reminder => !reminder.paid)
    .reduce((total, reminder) => total + reminder.amount, 0);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <PageTransition>
      <Navbar />
      <main className="page-container animate-fadeIn">
        {/* Page header */}
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your financial activities</p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <OverviewCard
            title="Upcoming Payments"
            value={reminders.filter(r => !r.paid).length.toString()}
            icon={<BellIcon className="w-4 h-4" />}
            change={{ value: 0, isPositive: true }}
            trend="up"
          />
          <OverviewCard
            title="Due This Month"
            value={`$${upcomingDueAmount.toFixed(2)}`}
            icon={<CalendarIcon className="w-4 h-4" />}
            change={{ value: 2.5, isPositive: false }}
            trend="down"
          />
          <OverviewCard
            title="Monthly Expenses"
            value={`$${expenses
              .filter(e => {
                const now = new Date();
                const expenseDate = new Date(e.date);
                return expenseDate.getMonth() === now.getMonth() && 
                       expenseDate.getFullYear() === now.getFullYear();
              })
              .reduce((sum, e) => sum + e.amount, 0)
              .toFixed(2)}`}
            icon={<DollarSignIcon className="w-4 h-4" />}
            change={{ value: 12.3, isPositive: false }}
            trend="down"
          />
          <OverviewCard
            title="Subscriptions"
            value={`$${getTotalMonthlyCost().toFixed(2)}/mo`}
            icon={<RefreshCcwIcon className="w-4 h-4" />}
            change={{ value: 0, isPositive: true }}
            trend="neutral"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Chart */}
          <div className="lg:col-span-2">
            <ExpenseChart data={chartData} />
          </div>

          {/* Right column: Upcoming payments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Upcoming Payments</h2>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/reminders')}>
                View all <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingReminders.length === 0 ? (
                <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
                  <BellIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">No upcoming payments</p>
                  <Button size="sm" variant="outline" onClick={() => navigate('/reminders')}>
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Reminder
                  </Button>
                </div>
              ) : (
                upcomingReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    id={reminder.id || ""}
                    title={reminder.title}
                    amount={reminder.amount}
                    dueDate={new Date(reminder.dueDate)}
                    category={reminder.category as any}
                    paid={reminder.paid || false}
                    recurring={reminder.recurring}
                    priority={reminder.priority as any}
                    onMarkPaid={markReminderPaid}
                    onSnooze={snoozeReminder}
                  />
                ))
              )}
            </div>

            {/* Recent expenses */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">Recent Expenses</h2>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/expenses')}>
                  View all <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {recentExpenses.length === 0 ? (
                  <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
                    <CreditCardIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">No recent expenses</p>
                    <Button size="sm" variant="outline" onClick={() => navigate('/expenses')}>
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Expense
                    </Button>
                  </div>
                ) : (
                  recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{expense.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming subscriptions */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">Upcoming Subscriptions</h2>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/subscriptions')}>
                  View all <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {upcomingSubscriptions.length === 0 ? (
                  <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
                    <RefreshCcwIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">No active subscriptions</p>
                    <Button size="sm" variant="outline" onClick={() => navigate('/subscriptions')}>
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Subscription
                    </Button>
                  </div>
                ) : (
                  upcomingSubscriptions.map((subscription) => (
                    <SubscriptionCard
                      key={subscription.id}
                      id={subscription.id || ""}
                      name={subscription.name}
                      amount={subscription.amount}
                      billingCycle={subscription.billingCycle}
                      category={subscription.category}
                      nextBillingDate={new Date(subscription.nextBillingDate)}
                      website={subscription.website}
                      onCancel={cancelSubscription}
                      compact
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
