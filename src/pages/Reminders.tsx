
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageTransition from '@/components/layout/PageTransition';
import Navbar from '@/components/layout/Navbar';
import ReminderCard from '@/components/reminders/ReminderCard';
import { ReminderForm } from '@/components/reminders/ReminderForm';
import { useReminders } from '@/hooks/use-reminders';
import { useAuth } from '@/hooks/use-auth';

export default function Reminders() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const { reminders, isLoading, addReminder, markReminderPaid, snoozeReminder } = useReminders();
  
  // Redirect to auth page if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/auth" />;
  }

  const upcomingReminders = reminders.filter((reminder) => !reminder.paid);
  const paidReminders = reminders.filter((reminder) => reminder.paid);

  return (
    <PageTransition>
      <Navbar />
      <div className="container max-w-5xl py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reminders</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Reminder
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-6 h-6 border-2 border-t-primary rounded-full animate-spin mb-2"></div>
              <p className="text-muted-foreground">Loading reminders...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-medium">Upcoming Payments</h2>
              {upcomingReminders.length === 0 ? (
                <div className="bg-muted rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">No upcoming payments.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setShowAddDialog(true)}>
                    Add your first reminder
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {upcomingReminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      id={reminder.id!}
                      title={reminder.title}
                      amount={reminder.amount}
                      dueDate={reminder.dueDate}
                      category={reminder.category as any}
                      paid={reminder.paid}
                      recurring={reminder.recurring}
                      priority={reminder.priority as any}
                      onMarkPaid={() => markReminderPaid(reminder.id!)}
                      onSnooze={() => snoozeReminder(reminder.id!)}
                    />
                  ))}
                </div>
              )}
            </section>

            {paidReminders.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-medium">Paid</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {paidReminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      id={reminder.id!}
                      title={reminder.title}
                      amount={reminder.amount}
                      dueDate={reminder.dueDate}
                      category={reminder.category as any}
                      paid={reminder.paid}
                      recurring={reminder.recurring}
                      priority={reminder.priority as any}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Reminder</DialogTitle>
            </DialogHeader>
            <ReminderForm
              onSubmit={(data) => {
                addReminder(data);
                setShowAddDialog(false);
              }}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
