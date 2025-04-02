
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import { useReminders } from "@/hooks/use-reminders";
import { useExpenses } from "@/hooks/use-expenses";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useAuth } from "@/hooks/use-auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { UpcomingReminders } from "@/components/dashboard/UpcomingReminders";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { UpcomingSubscriptions } from "@/components/dashboard/UpcomingSubscriptions";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Index() {
  const navigate = useNavigate();
  const { reminders, markReminderPaid, snoozeReminder } = useReminders();
  const { expenses, getMonthlyExpenseData } = useExpenses();
  const { subscriptions, cancelSubscription, getTotalMonthlyCost } = useSubscriptions();
  const { user, isLoading } = useAuth(true);
  const isMobile = useIsMobile();

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

  // Calculate monthly expenses amount
  const monthlyExpensesAmount = expenses
    .filter(e => {
      const now = new Date();
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === now.getMonth() && 
              expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

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
        <DashboardHeader 
          title="Dashboard" 
          description="Overview of your financial activities" 
        />

        {/* Overview cards */}
        <DashboardOverview 
          reminderCount={reminders.filter(r => !r.paid).length}
          upcomingDueAmount={upcomingDueAmount}
          monthlyExpensesAmount={monthlyExpensesAmount}
          totalSubscriptionCost={getTotalMonthlyCost()}
          currencySymbol="₹"
        />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Left column: Chart */}
          <div className={isMobile ? "order-2" : "lg:col-span-2"}>
            <ExpenseChart data={chartData} />
          </div>

          {/* Right column: Dashboard widgets */}
          <div className={isMobile ? "order-1" : ""}>
            <UpcomingReminders 
              reminders={upcomingReminders}
              onMarkPaid={markReminderPaid}
              onSnooze={snoozeReminder}
            />
            
            <RecentExpenses expenses={recentExpenses} />
            
            <UpcomingSubscriptions 
              subscriptions={upcomingSubscriptions}
              onCancel={cancelSubscription}
            />
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
